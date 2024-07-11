const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");
const taskRoutes = require("./routes/tasks.routes");
const path = require("path");
const bodyParser = require("body-parser");
require("./db");

const app = express();

app.use(bodyParser.json());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));
app.use(taskRoutes);

module.exports = app;
