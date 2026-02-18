const path = require("path");
const fs = require("fs");

const bcrypt = require("bcrypt");

const express = require("express");

const getDatabase = require("./db.js");

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const startServer = async () => {
  // Get the database stub
  const database = await getDatabase();

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/index.html"));
  });

  app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/login.html"));
  });

  app.post("/login", async (req, res) => {
    const { username, password } = req.body;
    const userRecord = database.select(
      (rec) => rec.username === username || rec.email === username,
    )[0];

    if (!userRecord) {
      // Send "invalid login" message back to client
      return res.json({
        error: true,
        message: "Invalid login / password",
      });
    }

    const isValid = await bcrypt.compare(password, userRecord.password);
    if (isValid) {
      // Redirect user to dashboard
      return res.json({
        success: true,
        redirect: "/dashboard",
      });
    }
    else {
      // Send "invalid login" message back to client
      return res.json({
        error: true,
        message: "Invalid login / password",
      });
    }
  });

  app.get("/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "/pages/dashboard.html"));
  });

  app.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
  });
};

startServer();
