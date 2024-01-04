// const sql = require("../utils/db");
const moment = require("moment");
const { object, string, number } = require("yup");

const courseModel = require("../models/course.model");
module.exports = {
  index: async (req, res) => {
    // console.log(db);
    //Đọc dữ liệu từ request
    const { keyword, status } = req.query;
    // console.log(keyword);
    //Read data table courses

    const courses = await courseModel.all(keyword, status);
    // console.log(courses);
    const msg = req.flash("msg");
    // console.log(msg);
    res.render("home/index", { courses, moment, msg });
    // console.log(courses);
    // } catch(e) {
    //     // throw new Error(message);
    // }

    // console.log(process.env.APP_NAME);
  },
  add: (req, res) => {
    // console.log(req.errors);

    // console.log(req);
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

  handleDelete: (req, res) => {
    // res.render("home/delete");
    // const body = await req.body;
    // console.log(req.params.id);

    courseModel.delete(req.params.id);

    // const courses = await courseModel.delete(req.params.id);
    // console.log("course fu"+ courses);
    // const msg = req.flash("msg");
    // res.render("home/index", { courses, msg, moment });
    return res.redirect("/");
  }
};
