const express = require('express');
const dotenv = require('dotenv');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🌹 Skyy Rose backend is LIVE — Fashion meets AI.');
});

// ✅ /seo-keywords — GPT powered
app.post('/seo-keywords', async (req, res) => {
  const { topic } = req.body;
  try {
    const gptRes = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You're an expert in fashion SEO." },
        {
          role: "user",
          content: `Give me 10 SEO keywords related to "${topic}". Return only a plain JSON array.`,
        },
      ],
    });
    const keywords = JSON.parse(gptRes.data.choices[0].message.content);
    res.json({ topic, keywords });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to get SEO keywords." });
  }
});

// ✅ /brand-name-generator
app.post('/brand-name-generator', async (req, res) => {
  const { vibe } = req.body;
  try {
    const gptRes = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You're a fashion brand strategist." },
        {
          role: "user",
          content: `Give me 5 luxury fashion brand name ideas based on the vibe: ${vibe}`,
        },
      ],
    });
    const suggestions = gptRes.data.choices[0].message.content.split('\n').filter(Boolean);
    res.json({ suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate brand names." });
  }
});

// ✅ /fashion-prompt
app.post('/fashion-prompt', (req, res) => {
  const { theme, gender } = req.body;
  const prompt = `Design a ${gender || 'gender-neutral'} high-end fashion look inspired by "${theme}" with futuristic elements and elevated textures.`;
  res.json({ prompt });
});

// ✅ /fashion-quote
app.get('/fashion-quote', (req, res) => {
  const quotes = [
    "Fashion is the armor to survive the reality of everyday life. – Bill Cunningham",
    "Style is a way to say who you are without having to speak. – Rachel Zoe",
    "You can have anything you want in life if you dress for it. – Edith Head",
    "Fashions fade, style is eternal. – Yves Saint Laurent",
    "Elegance is elimination. – Cristóbal Balenciaga"
  ];
  const quote = quotes[Math.floor(Math.random() * quotes.length)];
  res.json({ quote });
});

// ✅ /analyze-style
app.post('/analyze-style', (req, res) => {
  const { description } = req.body;
  let style = "Uncategorized";

  if (description.includes('leather') || description.includes('chains')) {
    style = "Grunge / Streetwear";
  } else if (description.includes('minimal') || description.includes('neutral tones')) {
    style = "Minimalist";
  } else if (description.includes('floral') || description.includes('lace')) {
    style = "Romantic / Boho";
  } else if (description.includes('tailored') || description.includes('structured')) {
    style = "Luxury / High Fashion";
  }

  res.json({ description, style });
});

// ✅ /upload-csv
app.post('/upload-csv', upload.single('file'), (req, res) => {
  const results = [];
  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      fs.unlinkSync(req.file.path); // clean up
      res.json({ rows: results.length, preview: results.slice(0, 5) });
    });
});

// ✅ /analyze-csv — GPT-powered
app.post('/analyze-csv', async (req, res) => {
  const { data } = req.body;

  try {
    const gptRes = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You're a fashion data strategist. Analyze fashion inventory or pricing data and return 3 insights in plain English.",
        },
        {
          role: "user",
          content: `Here is the data: ${JSON.stringify(data)}.`,
        },
      ],
    });

    const insights = gptRes.data.choices[0].message.content;
    res.json({ insights });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to analyze CSV data." });
  }
});

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Skyy Rose backend running on port ${PORT}`);
});


