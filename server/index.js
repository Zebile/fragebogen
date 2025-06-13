import express from 'express';
import multer from 'multer';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3001;
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

const DATA_FILE = path.resolve('data', 'answers.json');
const UPLOAD_DIR = path.resolve('uploads');
const WORD_FILE = path.resolve('data', 'questionnaire.docx');

if (!fs.existsSync('data')) fs.mkdirSync('data');
if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify([]));

app.post('/api/upload-word', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  const dest = WORD_FILE;
  fs.renameSync(req.file.path, dest);
  res.json({ success: true });
});

app.get('/api/download-excel', (req, res) => {
  // Einfach JSON zurückliefern, Frontend macht Excel-Export
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

app.post('/api/save-answers', (req, res) => {
  const newAnswer = req.body;
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  data.push(newAnswer);
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.json({ success: true });
});

app.get('/api/get-word', (req, res) => {
  if (!fs.existsSync(WORD_FILE))
    return res.status(404).send('No Word file uploaded');
  res.sendFile(WORD_FILE);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
