import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Multer-Setup für Datei-Uploads
const upload = multer({ dest: 'uploads/' });

// Statische Dateien aus dem Vite-Build-Ordner (dist) servieren
app.use(express.static(path.join(__dirname, '../dist')));

// API-Endpunkte

// Word-Datei vom Client hochladen
app.post('/api/upload-word', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Keine Datei hochgeladen' });
  }
  // Speichere die Datei als questionnaire.docx im uploads-Ordner
  const targetPath = path.join(__dirname, 'uploads', 'questionnaire.docx');
  fs.rename(req.file.path, targetPath, err => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Fehler beim Speichern der Datei' });
    }
    res.json({ success: true });
  });
});

// Word-Datei an den Client senden (für Parser)
app.get('/api/get-word', (req, res) => {
  const filePath = path.join(__dirname, 'uploads', 'questionnaire.docx');
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ success: false, message: 'Keine Word-Datei gefunden' });
  }
  res.sendFile(filePath);
});

// Beispiel: Antworten als Excel exportieren (Dummy-Daten, passe nach Bedarf an)
app.get('/api/download-excel', (req, res) => {
  // Dummy-Daten – ersetze dies durch deine echte Datenquelle!
  const data = [
    { code: 'AB27XY', frage1: 'Antwort A', frage2: 'Antwort B' },
    { code: 'CD11ZZ', frage1: 'Antwort C', frage2: 'Antwort D' },
  ];
  res.json(data);
});

// SPA Fallback: Alle anderen GET-Routen liefern index.html für das React-Routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Server starten
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});