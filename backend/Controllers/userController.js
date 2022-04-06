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

  addSingleUser = async (req, res) => {
    const { name, email, employeeID, role, password } = req.body;
    if (!name || !email || !password || !employeeID || !role) {
      return res.status(401).json({ message: "Data is missing" });
    } else if (!ROLE.includes(role)) {
      return res.status(401).json({ message: "Invalid role" });
    } else {
      try {
        const users = await client.query(
          `select * from users where email = $1`,
          [email]
        );

        if (users.rows.length != 0) {
          return res.status(400).json({ message: "User already exists" });
        } else {
          const hashed_password = bcrypt.hashSync(password, 12);
          const insert = client.query(
            `insert into users (name,email,employeeID,role,password) values($1,$2,$3,$4,$5)`,
            [name, email, employeeID, role, hashed_password],
            (err, resp) => {
              // console.log(resp);
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .json({ message: "Couldn't register. Please try again." });
              } else {
                console.log("user inserted");
                return res
                  .status(200)
                  .json({ message: "User Added Successfull" });
              }
            }
          );
        }
      } catch (err) {
        console.log(err);
        res
          .status(500)
          .json({ message: "Database error while adding new user" });
      }
    }
  };
}

module.exports = User;
