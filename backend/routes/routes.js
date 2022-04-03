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

module.exports = router;
