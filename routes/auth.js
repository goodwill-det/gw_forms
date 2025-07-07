const express = require("express");
const router = express.Router();
const db = require("../config/db");

// POST /api/login
router.post("/", (req, res) => {
  const { id, password } = req.body;

  if (!id || !password) {
    return res.status(400).json({ error: "Employee ID and password required" });
  }

  const query = "SELECT id, name, password, role FROM employees WHERE id = ?";
  db.query(query, [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) {
      return res.status(401).json({ error: "Invalid ID or password" });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid ID or password" });
    }

    // ✅ Login successful
    res.status(200).json({
      id: user.id,
      name: user.name,
      role: user.role
    });
  });
});

module.exports = router;
