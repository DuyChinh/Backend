var express = require('express');
var router = express.Router();
const homeController = require('../controllers/home.controller');

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get("/", homeController.index);
router.get("/add", homeController.add);
router.post("/add", homeController.handleAdd);
// router.get("/delete/:id", homeController.handleDelete);
router.get("/edit", homeController.edit);
router.post("/edit/:id", homeController.handleUpdate);

// router.get("/delete", homeController.deleteData);
router.post("/delete/:id", homeController.handleDelete);



module.exports = router;
