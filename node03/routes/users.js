var express = require('express');
var router = express.Router();
const userController =  require("../controllers/user.controller")
// const model = require("../models/index");
// const User = model.User;

/* GET users listing. */
// router.get('/',async function(req, res, next) {
//   // res.send('respond with a resource');
//   const users = await User.findAll();
//   console.log(users);
//   res.send('respond with a resource');
// });
router.get("/", userController.index);
router.get("/add", userController.add);
router.post("/add", userController.handleAdd);

router.get("/edit/:id", userController.edit);
router.post("/edit/:id", userController.handleEdit);
router.post("/delete/:id", userController.delete);
module.exports = router;
