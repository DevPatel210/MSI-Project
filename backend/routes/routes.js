var express = require("express");
var UserController = require("../Controllers/userController");
userController = new UserController();
var router = express.Router();

router.get("/", (req, res) => {
  console.log("API Works");
});

router.post("/login", (req, res) => {
  userController.login(req, res);
});

router.post("/verifyToken", (req, res) => {
  userController.verifyToken(req, res);
});

router.post("/register", (req, res) => {
  userController.register(req, res);
});

module.exports = router;
