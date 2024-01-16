const model = require("../models/index");
const moment = require("moment");
const User = model.User;
const Phone = model.Phone;
const Post = model.Post;
const Course = model.Course;

const { Op } = require("sequelize");
const phone = require("../models/phone");
module.exports = {
  index: async (req, res) => {
    const { status, keyword } = req.query;
    const filters = {};
    if (status === "active" || status === "inactive") {
      filters.status = status === "active";
    }
    if (keyword) {
      // filters.email = {
      //     [Op.iLike]: `%${keyword}%`,
      // }
      filters[Op.or] = [
        {
          name: {
            [Op.iLike]: `%${keyword}%`,
            //iLike -> ko pb hoa thường postgre hỗ trợ
          },
        },
        {
          email: {
            [Op.like]: `%${keyword}%`,
          },
        },
      ];
    }

    let { page = 1 } = req.query;
    if(!+page) {
      page = 1;
    }
    const limit = 3;
    const offset = (page - 1)*limit;

    let { rows: users, count } = await User.findAndCountAll({
      order: [
        ["id", "DESC"],
        ["created_at", "ASC"],
      ],
      where: filters,
      limit,
      offset,
      include: {
        model: Phone,
        as: "phone",
      }
    });
    const totalPage = Math.ceil(count / limit);
    // console.log(totalPage);
    /*
      - Lấy được trang hiện tại: req.query
      - Xác định limit: config
      - Tính offset: (page - 1)* limit
      - Tính tổng số bản ghi: findAndCountAll
      - Tính tổng số trang: Tổng số bản ghi / limit -> Làm tròn lên
      - Hiện thị số trang: Sử dụng paginate của bootstrap
    */
    // const phone = await user.getPhone();
    // for(let i= 0; i < users.length; i++) {
    //   const phone = await users[i].getPhone();
    //   users[i].phone = phone?.phone;
    // }
    // //for(let user of users)
    res.render("users/index", { users, moment, page, totalPage });
  },

  add: async (req, res) => {
     const courses = await Course.findAll({
       order: [["name", "asc"]],
     });
    res.render("users/add", {courses});
  },

  handleAdd: async (req, res) => {
    const { name, email, status } = req.body;
    const body = req.body;
    body.status = +body.status === 1;
    const courses = Array.from(body.courses);
    const user = await User.create(body);
    if(user && courses.length) {
      for(let courseId of courses) {
        const course = await Course.findByPk(courseId);
        console.log(course);
        if(course) {
          await user.addCourse(course);
          //vào bảng trung gian
        }
      }
    }
    // console.log(user);
    // console.log(name, email, status);
    // console.log(req.body);
    return res.redirect("/users");
  },

  edit: async (req, res, next) => {
    const {id} = req.params;
    // const user = await User.findByPk(id);
    try {
      const user = await User.findOne({
        where: { id: id },
        include: [
          {
            model: Post,
            as: "posts",
          },
          {
            model: Course,
            as: "courses",
          },
        ],
      });
      if(!user) {
        // return next(new Error("User isn't exist"));
        throw next(new Error("User isn't exist"));
      }

      const courses = await Course.findAll({
        order: [["name", "asc"]],
      });

      // const isChecked = users.map((user) => {

      // })


      // console.log(await user.getPhone());
      // const phone = await model.Phone.findOne({
      //   where: {phone: "0376573894"},
      // });
      // const user2 = await phone.getUser();
      // console.log(user2.name);
      res.render("users/edit", { user, courses });
    } catch(e) {
      return next(e);
    }
    // console.log(user);
   
  },

  handleEdit: async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    body.status = +body.status === 1;
    await User.update(body, {
      where: {id}
    });
    const courses = Array.from(body.courses);
    //Sử dụng hàm user.setCourses(array)
    //Cần có: 1 mảng chứa instance của từng khóa học
    if(courses.length) {
      const courseList = await Promise.all(
        courses.map((courseId) => Course.findByPk(courseId))
      );
      const user = await User.findByPk(id);
      await user.setCourses(courseList);
    }
    res.redirect("/users");
  },

  delete: async(req, res) => {
    const {id} = req.params;
    const status = await User.destroy({ 
      where: {id},
      // force: true, 
      /*xóa vĩnh viễn */
    });
    res.redirect("/users");
  }
};