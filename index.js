const express = require("express");
const path = require("path");

// bcrypt for hashing
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "static/index.html"));
});

app.post("/submit-data", (req, res) => {
  var { inputField } = req.body;
  console.log('Input field:', inputField);
  res.sendFile(path.join(__dirname, "static/done.html"));
});

app.listen(port, () => {
  console.log(`Server listening at https://localhost:${port}`);
});
