// Routes for auth

const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

//Register user
router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    // Validate input
    if (!firstname || !lastname) {
      return res
        .status(400)
        .json({ error: "Firstname or lastname can not be empty." });
    } else if (username.length < 5) {
      return res.status(400).json({
        error: "Invalid username - must be at least 5 characters long.",
      });
    } else if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password - must be at least 8 characters long.",
      });
    }

    //Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Check if user already exists
    const sqlCheck = "SELECT COUNT(*) AS count FROM users WHERE username = ?";
    db.get(sqlCheck, [username], (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Server error" });
      }
      if (row.count > 0) {
        return res.status(400).json({ error: "Username already exists" });
      }
      // If correct information - save user
      const sql = `INSERT INTO users(firstname, lastname, username, password) VALUES(?, ?, ?, ?)`;
      db.run(sql, [firstname, lastname, username, hashedPassword], (err) => {
        if (err) {
          return res.status(400).json({ message: "Error creating user" });
        } else {
          return res.status(201).json({ message: "User created" });
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (username.length < 5) {
      return res.status(400).json({
        error: "Invalid username - must be at least 5 characters long.",
      });
    } else if (password.length < 8) {
      return res.status(400).json({
        error: "Invalid password - must be at least 8 characters long.",
      });
    }

    // Check credentials
    // Check if user exists
    const sql = `SELECT * FROM users WHERE username=?`;
    db.get(sql, [username], async (err, row) => {
      if (err) {
        res.status(400).json({ message: "Error authenticating" });
      } else if (!row) {
        res.status(401).json({ message: "Incorrect username or password" });
      } else {
        // User exists
        const passwordMatch = await bcrypt.compare(password, row.password);
        if (!passwordMatch) {
          res.status(401).json({ message: "Incorrect username or password" });
        } else {
          //Create JWT
          const payload = { username: username };
          const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h",
          });
          const response = {
            message: "User logged in",
            token: token,
          };
          res.status(200).json({ response });
        }
      }
    });
  } catch {
    res.status(500).json({ error: "Server error" });
  }
});

//Update user
router.put("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const { firstname, lastname, username, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Update user details in the database
    const sql = `UPDATE users SET firstname=?, lastname=?, username=?, password=? WHERE id=?`;
    db.run(
      sql,
      [firstname, lastname, username, hashedPassword, userId],
      (err) => {
        if (err) {
          res.status(500).json({ error: "Server error" });
        } else {
          res.status(200).json({ message: "User updated successfully" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Delete user
router.delete("/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    // Delete user from the database
    const sql = `DELETE FROM users WHERE id=?`;
    db.run(sql, [userId], (err) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
