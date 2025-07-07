const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require('bcrypt');

// GET all employees
router.get("/", (req, res) => {
  db.query("SELECT id, name, role FROM employees WHERE deleted = 0", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// POST a new employee
router.post("/", (req, res) => {
  const { id, name, password, role } = req.body;

  if (!id || !name || !password) {
    return res.status(400).json({ error: "ID, name, and password are required" });
  }

  const query = "INSERT INTO employees (id, name, password, role) VALUES (?, ?, ?, ?)";
  db.query(query, [id, name, password, role || 'user'], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ id, name });
  });
});

// PUT to update employee
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name, password, role } = req.body;

  const updates = [];
  const values = [];

  if (name) {
    updates.push("name = ?");
    values.push(name);
  }

  if (password) {
    updates.push("password = ?");
    values.push(password);
  }

  if (role) {
    updates.push("role = ?");
    values.push(role);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: "No fields to update" });
  }

  values.push(id);

  const query = `UPDATE employees SET ${updates.join(", ")} WHERE id = ?`;
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  });
});

// DELETE employee - flag 1
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "UPDATE employees SET deleted = 1 WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Employee not found" });
    }

    res.json({ success: true });
  });
});

//get api employees
router.get('/', async (req, res) => {
    try{
        const [rows] = await db.promise().query('SELECT id, name FROM employees WHERE deleted = 0 ORDER by name');
        res.json(rows);
    }catch(err){
        console.error('Error fetching employees', err);
        res.status(500).json({ error: 'Failed to fetch employees '});
    }
});


//password encryption


// Change employee password
router.post("/update-password", async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const employeeId = req.session.employeeId; // make sure you store this in session on login

  if (!employeeId) {
    return res.status(401).send("Unauthorized");
  }

  try {
    // Fetch current hashed password
    const [rows] = await db.promise().query("SELECT password FROM employees WHERE id = ?", [employeeId]);

    if (rows.length === 0) {
      return res.status(404).send("Employee not found.");
    }

    const hashedPassword = rows[0].password;

    // Compare current password with stored hash
    const match = await bcrypt.compare(currentPassword, hashedPassword);
    if (!match) {
      return res.status(400).send("Current password is incorrect.");
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const newHashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password
    await db.promise().query("UPDATE employees SET password = ? WHERE id = ?", [newHashedPassword, employeeId]);

    res.status(200).send("Password updated successfully.");
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).send("Server error.");
  }
});

module.exports = router;
