require("dotenv").config();
const bcrypt = require("bcrypt");
const client = require("../database/db");
const jwt = require("jsonwebtoken");
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
            let token = jwt.sign({ username: userData.email }, privateKey, {
              expiresIn: "3h",
            });
            res.status(200).send({ message: "Login Successful", token: token });
          } else {
            res.status(400).json({ message: "Email or Password is wrong" });
          }
        }
      }
    );
  }

  verifyToken(req, res) {
    let token = req.body.token;
    if (token) {
      jwt.verify(token, privateKey, (err, data) => {
        if (err) {
          return res.status(401).json({ message: err });
        } else {
          return res.status(200).json({ username: data.username });
        }
      });
    } else {
      return res.status(401).json({ message: "No token found" });
    }
  }
}

module.exports = User;
