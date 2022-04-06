var express = require("express");
var UserController = require("../Controllers/userController");
userController = new UserController();
var userRouter = express.Router();

userRouter.get("/", (req, res) => {
  console.log("API Works");
});

userRouter.post("/add-single", userController.verifyToken, (req, res) => {
  userController.addSingleUser(req, res);
});

module.exports = userRouter;
