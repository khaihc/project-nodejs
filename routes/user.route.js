const express = require("express");
const userController = require('../controllers/user.controller')
const verify = require('./verifyToken');

const router = express.Router();

//Add
router.get('/', userController.home);

//login form
router.get("/login", userController.login);
router.post("/login", userController.handlingLogin);

router.post("/logout", userController.logout);


router.get('/add', userController.addRender);
router.post('/add', userController.addUser);

//List
router.get('/list', userController.listUser);

//Edit
router.get("/edit/:id", userController.editRender);
router.post("/edit", userController.editUser);


//Deleted
router.get("/delete/:id", userController.deleteUser);



module.exports = router
