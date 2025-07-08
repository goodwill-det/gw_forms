require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");


const employeeRoutes = require("./routes/employees");
const evaluationRoutes = require("./routes/evaluations");

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || 'localhost';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/employees", employeeRoutes);
app.use("/api/login", authRoutes);
app.use("/api/evaluations", evaluationRoutes);

// Start server
app.listen(PORT, HOST, () => {
  console.log(` Server running at http://${HOST}:${PORT}`);
});
