const express = require('express');
const path = require('path');

const bcrypt = require('bcrypt');
const saltRounds = 10;

const app = express();
const port = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Database stub
const database = [
  {
    username: 'admin1',
    email: 'admin@website.com',
    password: '@dm1np@$$word123',
  },
  {
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'LorenIpsumDolorSit',
  },
];

// Hash all passwords
async function hashPasswords() {
  for (const rec of database) {
    rec.password = await bcrypt.hash(rec.password, saltRounds);
  }
}

const startServer = async () => {
  await hashPasswords();

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/index.html'));
  });

  app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/login.html'));
  });

  app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const userRecord = database.find(rec => rec.username === username || rec.email === username);

    if (!userRecord) {
      // Send 'invalid login' message back to client
      return res.json({
        error: true,
        message: 'Invalid login / password',
      });
    }
    
    const isValid = await bcrypt.compare(password, userRecord.password)
    if (isValid) {
      // Redirect user to dashboard
      return res.json({
        success: true,
        redirect: '/dashboard',
      });
    }
    else {
      // Send 'invalid login' message back to client
      return res.json({
        error: true,
        message: 'Invalid login / password',
      });
    }
  });

  app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, '/pages/dashboard.html'));
  });

  app.listen(port, () => {
    console.log(`Server listening at https://localhost:${port}`);
  });
};

startServer();
