/******* 
DATABASE STUB
An emulated database meant to emulate interactions with a real database.
*******/

const fs = require("fs");

const bcrypt = require("bcrypt");
const saltRounds = 10;

async function getDatabase() {
  const records = JSON.parse(fs.readFileSync("./src/database.json", "utf8")).records;

  for (const rec of records) {
    rec.password = await bcrypt.hash(rec.password, saltRounds);
  }

  return {
    // Find all matching records.
    // Equivalent to a SELECT WHERE statement in SQL
    select(filter) {
      return records.filter(filter);
    },
    
    // Find a single matching record
    // Equivalent to a SELECT statement with LIMIT 1 (Postgres/MySQL), TOP 1 (SQL Server), or FETCH FIRST 1 ROWS ONLY (Oracle)
    find(filter) {
      return this.select(filter)[0];
    }
  }
}

module.exports = getDatabase;
