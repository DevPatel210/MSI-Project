require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../database/db");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const privateKey = process.env.PRIVATE_KEY;

// Roles in this project
const ROLE = ["admin", "manager", "employee"];

class User {
  constructor() {}
  login(req, res) {
    // check for data is present
    if (!req.body) res.status(400).json({ message: "Data not present" });

    let { email, password } = req.body;

    // query to get the data from db
    client.query(
      `select * from users where email = $1`,
      [email],
      (err, resp) => {
        if (err) {
          return res.status(400).json({ message: "Error in DB" });
        } else if (resp.rows.length == 0) {
          return res.status(404).json({ message: "User does not exists" });
        } else {
          // validate the login details
          let userData = resp.rows[0];
          var isValid = bcrypt.compareSync(password, userData.password);
          if (isValid) {
            // after validation generate a JWT token
            let token = jwt.sign({ email: userData.email }, privateKey, {
              expiresIn: "3h",
            });
            return res
              .status(200)
              .send({ message: "Login Successful", token: token });
          } else {
            return res
              .status(401)
              .json({ message: "Email or Password is wrong" });
          }
        }
      }
    );
  }

  verifyToken(req, res, next) {
    if (!req.headers.authorization) {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    let token = req.headers.authorization.split(" ")[1];
    if (token === "null") {
      return res.status(401).json({ message: "Unauthorized Access" });
    }
    let payload = jwt.verify(token, privateKey);
    req.email = payload.subject;
    next();
  }

  addSingleUser = (req, res) => {
    const { name, email, employeeID, role, password } = req.body;
    console.log("Step 1");
    if (!name || !email || !password || !employeeID || !role) {
      return res.status(401).send("Data is missing");
    }
    console.log("Step 2");
    if (!ROLE.includes(role)) {
      return res.status(401).send("Invalid role");
    }
    console.log("Step 3");
    client.query(
      `select * from users where email = $1`,
      [email],
      (err, resp) => {
        // console.log(resp.rows);
        if (err) {
          return res.status(400).send("Error in DB");
        } else if (resp.rows.length >= 1) {
          return res.status(404).send("User already exists");
        }
        console.log("Step 4");
      }
    );
    console.log("Step 5");
    const hashed_password = bcrypt.hashSync(password, 12);
    client.query(
      `insert into users (name,email,employeeID,role,password) values($1,$2,$3,$4,$5)`,
      [name, email, employeeID, role, hashed_password],
      (err, resp) => {
        // console.log(resp);
        if (err) {
          console.log(err);
          return res.status(400).send("Couldn't register. Please try again.");
        } else {
          console.log("Step 6");
          console.log("user inserted");
          return res.status(200).send("User Added Successfull");
        }
      }
    );
  };
}

module.exports = User;
