// Server-application for registration and login

//Requires
const express = require("express");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const router = express.Router();
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();

//Connect to database
const db = new sqlite3.Database(process.env.DATABASE);

//Variables
const port = process.env.PORT || 3000;

const app = express();
app.use(bodyParser.json());

//Routes
app.use(cors());
app.use("/api", authRoutes);

// Get all users
app.get("/api/users", async (req, res) => {
  try {
    const sql = `SELECT * FROM users`;
    db.all(sql, [], (err, rows) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        res.status(200).json(rows);
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get user by ID
app.get("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const sql = `SELECT * FROM users WHERE id = ?`;
    db.get(sql, [userId], (err, row) => {
      if (err) {
        res.status(500).json({ error: "Server error" });
      } else {
        if (!row) {
          res.status(404).json({ error: "User not found" });
        } else {
          res.status(200).json(row);
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

//Protected route
app.get("/api/secret", authenticateToken, (req, res) => {
  console.log("secret");
  res.json({ message: "Protected route" });
});

//Validate token
function authenticateToken(req, res, next) {
  console.log(req.headers);
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) {
    res.status(401).json({ message: "Not authorized - token missing" });
  }

  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, username) => {
    if (err) {
      return res.status(403).json({ message: "Invalid JWT" });
    }
    req.username = username;
    next();
  });
}

//Start application
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
