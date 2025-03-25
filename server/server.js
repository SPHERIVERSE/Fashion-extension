const express = require('express');
const fetch = require('node-fetch');
const app = express();
const port = 3000;
const apiKey = 'YOUR_GEMINI_API_KEY'; // Store this securely!

app.use(express.json());

app.post('/api/similar', async (req, res) => {
    const { prompt } = req.body;
    const apiUrl = 'YOUR_GEMINI_API_ENDPOINT'; // Replace with Gemini API endpoint

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Gemini API request failed with status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data); // Send Gemini API response to the extension
    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ error: 'Gemini API request failed' });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
