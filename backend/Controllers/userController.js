require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../database/db");
const jwt = require("jsonwebtoken");
const { nextTick } = require("process");
const privateKey = process.env.PRIVATE_KEY;

// Roles in this project
const ROLE = {
  admin: "admin",
  manager: "manager",
  employee: "employee",
};

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
          res.status(400).json({ message: "Error in DB" });
        } else if (resp.rows.length == 0) {
          res.status(404).json({ message: "User does not exists" });
        } else {
          // validate the login details
          let userData = resp.rows[0];
          var isValid = bcrypt.compareSync(password, userData.password);
          if (isValid) {
            // after validation generate a JWT token
            let token = jwt.sign({ email: userData.email }, privateKey, {
              expiresIn: "3h",
            });
            res.status(200).send({ message: "Login Successful", token: token });
          } else {
            res.status(401).json({ message: "Email or Password is wrong" });
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
  register = (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(401).send("Data is not present");
    }
    client.query(
      `select * from users where email = $1`,
      [email],
      (err, resp) => {
        // console.log(resp.rows);
        if (err) {
          res.status(400).send("error in db");
        } else if (resp.rows.length >= 1) {
          res.status(404).send("user already exists");
        }
      }
    );
    const hashed_password = bcrypt.hashSync(password, 12);
    client.query(
      `insert into users (email,password) values($1,$2)`,
      [email, hashed_password],
      (err, resp) => {
        // console.log(resp);
        if (err) {
          console.log(err);
          res.status(400).send("Can't register. Please try again.");
        } else {
          console.log("user inserted");
          res.status(200).send("Registration Successfull");
        }
      }
    );
  };
}

module.exports = User;
