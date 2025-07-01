const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const OpenAI = require('openai');

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const PORT = process.env.PORT || 3000;

// 🌹 Root check
app.get('/', (req, res) => {
  res.send('🌹 Skyy Rose backend is alive.');
});

// ✨ Fashion Quote
app.get('/fashion-quote', (req, res) => {
  const quotes = [
    "Fashion is the armor to survive the reality of everyday life. – Bill Cunningham",
    "Style is a way to say who you are without having to speak. – Rachel Zoe",
    "You can have anything you want in life if you dress for it. – Edith Head",
    "Fashions fade, style is eternal. – Yves Saint Laurent",
    "Elegance is elimination. – Cristóbal Balenciaga",
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote });
});

// 🔮 Fashion Prompt Generator
app.post('/fashion-prompt', (req, res) => {
  const { theme, gender } = req.body;
  const prompt = `Design a ${gender || 'gender-neutral'} high-end fashion look inspired by "${theme}" with luxurious textures, storytelling, and elevated color use.`;
  res.json({ prompt });
});

// 🧵 Style Analyzer
app.post('/analyze-style', (req, res) => {
  const { description } = req.body;
  let style = "Uncategorized";

  if (description.includes('leather') || description.includes('chains')) {
    style = "Grunge / Streetwear";
  } else if (description.includes('minimal') || description.includes('neutral')) {
    style = "Minimalist";
  } else if (description.includes('floral') || description.includes('lace')) {
    style = "Romantic / Boho";
  } else if (description.includes('tailored') || description.includes('structured')) {
    style = "Luxury / High Fashion";
  }

  res.json({ description, style });
});

// 📤 CSV Upload
app.post('/upload-csv', upload.single('file'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(req.file.path); // Clean up
      res.json({ preview: results.slice(0, 5), rows: results.length });
    })
    .on('error', (err) => {
      console.error('CSV Upload Error:', err);
      res.status(500).json({ error: 'Failed to process CSV.' });
    });
});

// 🧠 Analyze CSV Content with GPT
app.post('/analyze-csv', async (req, res) => {
  const { data } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are Skyy Rose, a fashion-forward data analyst. Analyze the CSV data and provide brand-level fashion insights.',
        },
        {
          role: 'user',
          content: `Here is the CSV data: ${JSON.stringify(data)}. Summarize 3 insights about fashion customer trends.`,
        },
      ],
    });

    const insights = completion.choices[0].message.content.trim();
    res.json({ insights });
  } catch (error) {
    console.error('CSV Analysis Error:', error.message);
    res.status(500).json({ error: 'Failed to analyze CSV.' });
  }
});

// 🔎 SEO Keyword Generator
app.post('/seo-keywords', async (req, res) => {
  const { topic } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a poetic, fashion-minded SEO strategist named Skyy Rose.',
        },
        {
          role: 'user',
          content: `Generate 10 SEO keywords for: "${topic}". Return only a JSON array.`,
        },
      ],
    });

    const output = completion.choices[0].message.content.trim();
    const keywords = JSON.parse(output);
    res.json({ topic, keywords });
  } catch (error) {
    console.error('SEO Error:', error.message);
    res.status(500).json({ error: 'SEO generation failed.' });
  }
});
// 💬 General Chat Endpoint
app.post('/chat', async (req, res) => {
  const userMessage = req.body.message;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are Skyy Rose, a stylish and smart virtual assistant.' },
        { role: 'user', content: userMessage },
      ],
    });

    const reply = completion.choices[0].message.content.trim();
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({ error: 'Chat failed. Please try again.' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Skyy Rose backend is running on port ${PORT}`);
});

