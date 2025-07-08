const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.post("/", (req, res) => {
  const {
    employee_id, dressed, direction, performed, supervision, helpfulness,
    beyond, attitude, attendance, paperwork, organize, safety,
    total, grade
  } = req.body;

  const sql = `
    INSERT INTO evaluations (
      employee_id, dressed, direction, performed, supervision,
      helpfulness, beyond, attitude, attendance, paperwork,
      organize, safety, total, grade
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    employee_id, dressed, direction, performed, supervision,
    helpfulness, beyond, attitude, attendance, paperwork,
    organize, safety, total, grade
  ];

  console.log("✅ Received evaluation:", req.body);

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ DB error:", err);
      return res.status(500).send("Database insert failed.");
    }

    res.status(200).send("✅ Evaluation saved.");
  });
});

module.exports = router;
