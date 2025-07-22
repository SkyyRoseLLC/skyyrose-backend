const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Root route for Render health check:
app.get('/', (req, res) => {
  res.send('✅ Skyy Rose Concierge backend running');
});

// POST /chat endpoint to forward chat requests securely:
app.post('/chat', async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o', // Or whichever model you want to use
        messages: [
          { role: 'system', content: 'You are Skyy Rose, a poetic, resilient, luxury concierge from Oakland.' },
          ...messages
        ]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Error forwarding request to OpenAI:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal Server Error from Skyy Rose Concierge backend' });
  }
});

// Start the server on Render’s recommended port:
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Skyy Rose backend running on port ${PORT}`);
});
