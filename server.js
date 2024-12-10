require('dotenv').config();
const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');

const app = express();
const port = process.env.PORT || 3000;

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Chat endpoint
app.post('/api/chat', async (req, res) => {
    try {
        const { message, context = [] } = req.body;
        
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                ...context,
                { role: "user", content: message }
            ],
            temperature: 0.7,
            max_tokens: 1000
        });

        res.json({
            message: completion.choices[0].message.content,
            context: [
                ...context,
                { role: "user", content: message },
                { role: "assistant", content: completion.choices[0].message.content }
            ]
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
