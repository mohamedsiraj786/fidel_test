// Instead of: const fetch = require('node-fetch');
// Use:

const path = require('path');

let fetch;
// Use dynamic import
import('node-fetch').then(({ default: fetch }) => {
    // Your server code here that depends on fetch
}).catch(err => {
    console.error('Failed to import node-fetch:', err);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

app.use(express.static(path.join(__dirname, 'public')));

// Render index.html for the root endpoint
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'MentalAI.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/public/register.html');
});




app.post('/api/chatgpt', async (req, res) => {
    const chatGPTResponse = await fetch('https://chat.freedomgpt.com/api/liberty', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
    });

    const data = await chatGPTResponse.json();
    res.json(data);
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});