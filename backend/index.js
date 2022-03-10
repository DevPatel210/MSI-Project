var express = require("express");
var app = express();
const cors = require("cors");
var router = require("./routes/routes");
var corsOptions = {
  origin: "http://localhost:4200",
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT, POST",
};

app.use(cors(corsOptions));
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

app.use("/", router);

app.listen(3000, () => {
  console.log("server started");
});
