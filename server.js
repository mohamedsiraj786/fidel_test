const { MongoClient } = require('mongodb');
const mongoose = require('mongoose')
const path = require('path');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
const connectDB = require('./db');
const User = require('./User');

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the 'Public' directory
app.use(express.static(path.join(__dirname, 'Public')));

// Route to serve the Login.html page
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Public', 'index.html'));
});


app.get('/register', (req, res) => {
    res.sendFile(__dirname , 'Public','register.html');
});

app.post('/api/chatgpt', async (req, res) => {
    try {
        const chatGPTResponse = await fetch('https://chat.freedomgpt.com/api/liberty', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(req.body),
        });

        const data = await chatGPTResponse.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

connectDB();

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
        res.status(201).send({"message":"User Registered Successfully"});
    } catch (err) {
        console.error(err);
        res.status(500).send("User Registration Failed");
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
            const accessToken = jwt.sign({ username: user.username }, process.env.ACCESS_TOKEN_SECRET);
            res.status(200).json({ accessToken });
        } else {
            res.status(401).send("Invalid password");
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal Server Error");
    }
});

app.listen(process.env.PORT, () => console.log(`Server is running on http://localhost:${process.env.PORT}`));
