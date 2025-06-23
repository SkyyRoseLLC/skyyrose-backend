import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Skyy Rose backend is live!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('🌹 Skyy Rose backend is LIVE — Fashion meets AI.');
});

// 🔍 SEO Keyword Generator
app.post('/seo-keywords', (req, res) => {
  const { topic } = req.body;
  const keywords = [
    `${topic} streetwear`,
    `${topic} outfit inspiration`,
    `${topic} capsule wardrobe`,
    `${topic} luxury branding`,
    `2025 ${topic} fashion trends`,
  ];
  res.json({ topic, keywords });
});

// 🧠 Brand Name Generator
app.post('/brand-name-generator', (req, res) => {
  const { vibe } = req.body;
  const names = [
    `House of ${vibe}`,
    `${vibe} Studios`,
    `${vibe} Noir`,
    `${vibe} & Co.`,
    `The ${vibe} Collective`,
  ];
  res.json({ suggestions: names });
});

// 🎨 AI Fashion Prompt Generator
app.post('/fashion-prompt', (req, res) => {
  const { theme, gender } = req.body;
  const prompt = `Design a ${gender || 'gender-neutral'} high-end fashion look inspired by "${theme}" with futuristic elements, minimalism, and elevated textures.`;
  res.json({ prompt });
});

// 📊 Excel Insight (Basic)
app.post('/excel-insight', (req, res) => {
  const { data } = req.body;

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Data must be a non-empty array.' });
  }

  const numRows = data.length;
  const keys = Object.keys(data[0]);
  const summary = keys.map((key) => {
    const values = data.map(row => parseFloat(row[key])).filter(val => !isNaN(val));
    const avg = values.reduce((a, b) => a + b, 0) / (values.length || 1);
    return { column: key, average: Number(avg.toFixed(2)) };
  });

  res.json({ rows: numRows, summary });
});

// 🗣️ Fashion Quote Generator
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

// 🔎 Style Analyzer
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

// ✅ Start the server
app.listen(PORT, () => {
  console.log(`✅ Skyy Rose Fashion API running on port ${PORT}`);
});

