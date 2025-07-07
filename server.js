const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/auth");
const app = express();
const PORT = 3000;

const employeeRoutes = require("./routes/employees");
const evaluationRoutes = require("./routes/evaluations");
// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/employees", employeeRoutes);
app.use("/api/login", authRoutes);
app.use("/api/evaluations", evaluationRoutes);
// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
