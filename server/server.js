const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/similar', async (req, res) => {
    const { prompt } = req.body;
    const pythonApiUrl = 'http://localhost:5000/generate'; // Flask API endpoint

    try {
        const response = await fetch(pythonApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Python API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Send Python API response to the extension
    } catch (error) {
        console.error('Python API Error:', error);
        res.status(500).json({ error: 'Python API request failed' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
