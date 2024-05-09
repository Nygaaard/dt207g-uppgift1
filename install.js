require("dotenv").config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

//Connect
const db = new sqlite3.Database(process.env.DATABASE);

//Create table users
db.serialize(() => {
  //Drop table if exists
  db.run("DROP TABLE IF EXISTS users");

  db.run(`CREATE TABLE users(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstname VARCHAR(30) NOT NULL,
        lastname VARCHAR(30) NOT NULL,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created DATETIME DEFAULT CURRENT_TIMESTAMP
    )`);

  console.log("Table created");
});
