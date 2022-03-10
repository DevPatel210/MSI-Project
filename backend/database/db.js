require("dotenv").config();
const cli = require("nodemon/lib/cli");
const { Pool, Client } = require("pg");
const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DB,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});
client.connect().then(() => {
  console.log("database connectedd");
});

module.exports = client;
