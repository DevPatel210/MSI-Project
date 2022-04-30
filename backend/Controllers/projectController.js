require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../database/db");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const http = require("http");
const privateKey = process.env.PRIVATE_KEY;
const csv = require("fast-csv");

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
    console.log(req.body);
    const {
      id,
      projectname,
      deptcode,
      users,
      product,
      status,
      cieareaid,
      financeproductid,
    } = req.body;
    if (
      !id ||
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
      const updatedat = new Date().toISOString();
      client.query(
        `UPDATE projects SET projectname=$2,deptcode=$3,users=$4,products=$5,status=$6,updatedat=$7,cieareaid=$8,financeproductid=$9 where id=$1`,
        [
          id,
          projectname,
          deptcode,
          users,
          product,
          status,
          updatedat,
          cieareaid,
          financeproductid,
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

  // ------------------------- Delete Projects -----------------------
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

  // ------------------------- Add Bulk Projects -----------------------
  async addBulkProjects(req, res) {
    // console.log(req.file.buffer.toString("utf-8"));
    const start = new Date();

    try {
      const csvData = await this.csvParse(req.file.buffer);
      csvData.shift();
      const errorList = await this.runQuery(csvData);
      console.log(errorList);
      console.log("Time: ", new Date() - start);
      if (errorList.length == 0)
        res.status(201).json({ message: "Data inserted succesfully" });
      else {
        res.status(201).json({
          message:
            "Some entries were added successfully. Entries with error are shown with error message",
          errorList: errorList,
        });
      }
    } catch (err) {
      res.status(400).json({ message: err });
    }
  }
  async runQuery(csvData) {
    let errorList = [];
    const query =
      "insert into projects (projectname,deptcode,users,products,status,cieareaid,financeproductid,createdat,updatedat) VALUES ($1, $2, STRING_TO_ARRAY($3,','), $4, $5, $6, $7, $8, $9)";

    const promises = csvData.map(async (row, ind) => {
      row.push(new Date().toISOString());
      row.push(new Date().toISOString());
      try {
        const q = await client.query(query, row);
        return q;
      } catch (err) {
        console.log(err.message);
        errorList.push({ row: ind + 1, message: err.message });
      }
    });
    const q = await Promise.all(promises);
    // console.log("hello");
    return errorList;
  }
  csvParse(file) {
    return new Promise((resolve, reject) => {
      let csvData = [];
      let csvStream = csv
        .parse()
        .on("error", function (err) {
          reject("Error in parsing csv file. Please try again");
        })
        .on("data", function (data) {
          csvData.push(data);
        })
        .on("end", function () {
          // Remove Header ROW
          resolve(csvData);
        });
      csvStream.write(file, "utf-8");
      csvStream.end();
    });
  }
}

module.exports = Project;
