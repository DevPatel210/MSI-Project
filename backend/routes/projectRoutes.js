var express = require("express");
var UserController = require("../Controllers/userController");
var ProjectController = require("../Controllers/projectController");
userController = new UserController();
projectController = new ProjectController();
var projectRouter = express.Router();

projectRouter.get("/", (req, res) => {
  console.log("API Works");
});

projectRouter.get("/get", userController.verifyEmployeeToken, (req, res) => {
  projectController.getProjects(req, res);
});
projectRouter.get(
  "/get-user",
  userController.verifyEmployeeToken,
  (req, res) => {
    projectController.getUsers(req, res);
  }
);
//
projectRouter.post(
  "/add-single",
  userController.verifyManagerToken,
  (req, res) => {
    projectController.addSingleProject(req, res);
  }
);

projectRouter.put("/update", userController.verifyAdminToken, (req, res) => {
  projectController.updateProject(req, res);
});

projectRouter.post("/delete", userController.verifyAdminToken, (req, res) => {
  projectController.deleteProjects(req, res);
});

module.exports = projectRouter;
