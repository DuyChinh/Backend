// const sql = require("../utils/db");
const moment = require("moment");
const { object, string, number } = require("yup");

const courseModel = require("../models/course.model");
module.exports = {
  index: async (req, res) => {

    //Đọc dữ liệu từ request
    const { keyword, status } = req.query;
    const courses = await courseModel.all(keyword, status);
    // console.log(courses);
    const msg = req.flash("msg");
    const msgDelete = req.flash("msg-delete");
    // console.log(msg);
    res.render("home/index", { courses, moment, msg, msgDelete });
    
  },
  add: (req, res) => {
    // console.log(req.errors);

    // console.log(req);
    // console.log(req.errors);
    res.render("home/add", { req });
  },

  handleAdd: async (req, res) => {
    // const schema = object({
    //   name: string().required("Tên Khóa học bắt buộc phải nhập!"),
    //   price: string().required("Giá khóa học bắt buộc phải nhập!"),
    // });
    // try {
    //   const body = await schema.validate(req.body, {
    //     abortEarly: false,
    //   });
    // } catch (e) {
    //   const errors = Object.fromEntries(
    //     e.inner.map((item) => [item.path, item.message])
    //   );
    //   console.log(errors);
    //   req.flash("errors", errors);
    // }
    // console.log(req.body);
    const body = await req.validate(req.body, {
        name: string().required("Tên khóa học bắt buộc phải nhập!").test('check-unique', 'Tên khóa học đã tồn tại', async(value) => {
            return await courseModel.courseUnique(value);
        }),
        price: string().required("Giá khóa học bắt buộc phải nhập!").test('check-number', 'Giá khóa học phải là số', (value) => {
            value = +value;
            if(!isNaN(value)) {
                return true;
            }
            return false;
        }),
    });
    if(body) {
        courseModel.create(body);
        req.flash("msg", 'Add course successfully');
        return res.redirect("/");
    }

    
    // console.log(req.body);
    // console.log(body);
    return res.redirect("/add");
    /*
        Validate:
        - Name: bắt buộc, không bị trùng
        - Price: bắt buộc, số
        Insert Database
        Redirect kèm thông báo
        */
  },
  handleDelete: async (req, res) => {
    const id = req.params.id;
    try {
      const courseId = await courseModel.findId(id);
      // console.log(courseId);
    
      if(!courseId) {
        return res.status(404).send("Course not found");
      }

      await courseModel.delete(id);

      req.flash("msg-delete", "Delete course successfully");
      return res.redirect("/");
    } catch (error) {
      return res.status(500).send("Delete course failed. Let's try again!");
    }
  },

  edit: async(req, res) => {
    
    const id = +req.params.id;
    req.session.courseId = id;
    // console.log(id);
    const courses = await courseModel.findId(id);
    // // console.log(courses[0]);
    const course = courses[0];
    res.render("home/edit", { course, req });
    
  },

  handleUpdate: async (req, res) => {
    // console.log(req.body);
    // console.log(req.body.id);
    const id = req.body.id;
    const body = await req.validate(req.body, {
      name: string().required('Tên khóa học phải nhập!'),
      price: string().required('Giá bắt buộc phải nhập!').test('check-number', 'Giá khóa học phải là số', (value) => {
        value = +value;
        if(!isNaN(value)) {
          return true; 
        }
        return false;
      })
    })
    if(body) {
      // console.log(req.session.courseId + " " + id);
      if(+id !== +req.session.courseId) {
        return res.status(404).send("Course not found");;
      } 
      await courseModel.update(body, id);

      return res.redirect("/");
    }
    
  // console.log(body);
    // console.log(req.body);
  }
};
