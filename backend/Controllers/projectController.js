require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../database/db");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const privateKey = process.env.PRIVATE_KEY;

class Project {
  constructor() {}

  // ------------------------- Add Single Project -----------------------
  addSingleProject = async (req, res) => {
    const {
      projectname,
      deptcode,
      users,
      product,
      status,
      cieareaid,
      financeproductid,
    } = req.body;

    if (
      !projectname ||
      !deptcode ||
      !users ||
      !product ||
      typeof status != "boolean" ||
      typeof cieareaid != "number" ||
      typeof financeproductid != "number"
    ) {
      return res.status(401).json({ message: "Data is missing" });
    } else {
      const createdat = new Date().toISOString();
      const updatedat = createdat;

      try {
        const insert = client.query(
          `insert into projects (projectname,deptcode,users,products,status,createdat,updatedat,cieareaid,financeproductid) values($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
          [
            projectname,
            deptcode,
            users,
            product,
            status,
            createdat,
            updatedat,
            cieareaid,
            financeproductid,
          ],
          (err, resp) => {
            // console.log(resp);
            if (err) {
              console.log(err);
              return res
                .status(500)
                .json({ message: "Couldn't Insert. Please try again." });
            } else {
              console.log("Project inserted");
              return res
                .status(200)
                .json({ message: "Project Added Successfull" });
            }
          }
        );
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Database error while adding new project" });
      }
    }
  };

  // ------------------------- Get All Projects -----------------------
  getProjects(req, res) {
    client.query(`select * from projects`, (err, resp) => {
      if (err) {
        return res.status(400).json({ message: "Error in DB" });
      } else {
        return res
          .status(200)
          .json({ message: "Data sent successfully", data: resp.rows });
      }
    });
  }

  // ------------------------- Get All Users name -----------------------
  getUsers(req, res) {
    client.query(`select name from users`, (err, resp) => {
      if (err) {
        return res.status(400).json({ message: "Error in DB" });
      } else {
        return res
          .status(200)
          .json({ message: "Data sent successfully", data: resp.rows });
      }
    });
  }

  // ------------------------- Update Project -----------------------
  updateProject(req, res) {
    const { name, email, employeeID, role } = req.body;
    const {
      id,
      projectName,
      deptCode,
      users,
      products,
      status,
      createdAt,
      updatedAt,
      cieAreaId,
      financeProductId,
    } = req.body;
    if (
      !id ||
      !projectName ||
      !deptCode ||
      !users ||
      !products ||
      status == "" ||
      !createdAt ||
      !updatedAt ||
      !cieAreaId ||
      !financeProductId
    ) {
      return res.status(401).json({ message: "Data is missing" });
    } else {
      client.query(
        `UPDATE projects SET projectname=$2,deptcode=$3,users=$4,products=$5,status=$6,createdat=$7,updatedat=$8,cieareaid=$9,financeproductid=$10 where id=$1`,
        [
          id,
          projectName,
          deptCode,
          users,
          products,
          status,
          createdAt,
          updatedAt,
          cieAreaId,
          financeProductId,
        ],
        (err, resp) => {
          if (err) {
            return res.status(400).json({ message: "Error in DB" });
          } else {
            console.log("Updated");
            return res
              .status(200)
              .json({ message: "Project updated successfully" });
          }
        }
      );
    }
  }

  // ------------------------- Delete Users -----------------------
  deleteProjects(req, res) {
    const projects = req.body;
    console.log(projects);
    client.query(
      `DELETE from projects where id = any($1);`,
      [projects],
      (err, resp) => {
        if (err) {
          console.log(err);
          return res.status(400).json({ message: "Error in DB" });
        } else {
          // console.log(resp);
          return res
            .status(200)
            .json({ message: "Projects deleted successfully" });
        }
      }
    );
  }
}

module.exports = Project;
