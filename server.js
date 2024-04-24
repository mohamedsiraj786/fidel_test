const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const session = require('express-session');
require('dotenv').config();
const connectDB = require('./db');
const User = require('./User');

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')));

// Initialize session middleware
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
}));

connectDB();


app.get("/", async(req, res) =>

{
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})
// Registration route
app.post('/register', async (req, res) => {
  try {
    const record = req.body;
    if (!record.username || !record.password) return res.status(400).send('Missing field');


    const hashedPassword = await bcrypt.hash(record.password, 10);
    const newUser = new User({
      username: record.username,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).send({ "message": "User Registered Successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json(   {"message":"already This Username Registered"});
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).send("User not found");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      // Set session data
      req.session.username = user.username;

      const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
      console.log(accessToken, "access")
      res.status(200).json({ "message": "Logged In Success" });
    } else {
      res.status(401).send("Invalid password");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal Server Error");
  }
});

// Dashboard route
app.get('/dashboard', (req, res) => {
  // Check if user is logged in
  if (req.session.username) {
    res.sendFile(path.join(__dirname, 'Public', 'chatbot.html'));
  } else {
    res.redirect('/'); // Redirect to login if not logged in
  }
});

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
