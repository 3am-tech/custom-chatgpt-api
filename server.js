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
        
        // Function to chunk the response
        async function generateCompleteResponse(message, context) {
            let fullResponse = '';
            let isComplete = false;
            let attempts = 0;
            const maxAttempts = 5; // Limit the number of chunks to prevent infinite loops
            
            while (!isComplete && attempts < maxAttempts) {
                const currentPrompt = attempts === 0 ?
                    message :
                    `Continue the following response: "${fullResponse}"`;

                const completion = await openai.chat.completions.create({
                    model: "gpt-3.5-turbo",
                    messages: [
                        ...context,
                        { role: "user", content: currentPrompt }
                    ],
                    temperature: 0.7,
                    max_tokens: 1000,
                    stop: ["[DONE]"] // Optional stop sequence
                });

                const chunkResponse = completion.choices[0].message.content;
                fullResponse += chunkResponse;

                // Check if response seems complete
                isComplete = chunkResponse.trim().endsWith('.') ||
                           chunkResponse.trim().endsWith('!') ||
                           chunkResponse.trim().endsWith('?') ||
                           chunkResponse.includes('[DONE]');
                
                attempts++;
            }

            return fullResponse;
        }

        const completeResponse = await generateCompleteResponse(message, context);

        res.json({
            message: completeResponse,
            context: [
                ...context,
                { role: "user", content: message },
                { role: "assistant", content: completeResponse }
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
