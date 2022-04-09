var express = require("express");
var UserController = require("../Controllers/userController");
userController = new UserController();
var userRouter = express.Router();

userRouter.get("/", (req, res) => {
  console.log("API Works");
});

userRouter.get("/get", userController.verifyAdminToken, (req, res) => {
  userController.getUsers(req, res);
});

userRouter.post("/add-single", userController.verifyAdminToken, (req, res) => {
  userController.addSingleUser(req, res);
});

userRouter.put("/update", userController.verifyAdminToken, (req, res) => {
  userController.updateUser(req, res);
});

userRouter.post("/delete", userController.verifyAdminToken, (req, res) => {
  userController.deleteUsers(req, res);
});

module.exports = userRouter;
