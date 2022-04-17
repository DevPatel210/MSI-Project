var express = require("express");
var app = express();
const cors = require("cors");
var router = require("./routes/routes");
var userRouter = require("./routes/userRoutes");
var projectRouter = require("./routes/projectRoutes");
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
app.use("/user", userRouter);
app.use("/project", projectRouter);

app.listen(3000, () => {
  console.log("server started");
});
