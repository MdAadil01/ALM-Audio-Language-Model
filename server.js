import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { SpeechClient } from '@google-cloud/speech';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const speechClient = new SpeechClient();

app.use(express.static(__dirname));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

function guessEncoding(mimeType) {
  const mt = (mimeType || '').toLowerCase();
  if (mt === 'audio/wav' || mt === 'audio/x-wav' || mt === 'audio/wave') return 'LINEAR16';
  if (mt === 'audio/flac') return 'FLAC';
  return null;
}

app.post('/api/transcribe', upload.single('audio'), async (req, res) => {
  try {
    const file = req.file;
    const languageCode = (req.body?.languageCode || 'en-US').toString();

    if (!file) {
      res.status(400).json({ error: 'Missing audio file.' });
      return;
    }

    const encoding = guessEncoding(file.mimetype);
    if (!encoding) {
      res.status(400).json({
        error: 'Unsupported audio format. Please upload WAV (audio/wav) or FLAC (audio/flac).',
      });
      return;
    }

    const audio = {
      content: file.buffer.toString('base64'),
    };

    const config = {
      encoding,
      languageCode,
      enableAutomaticPunctuation: true,
    };

    const [response] = await speechClient.recognize({ audio, config });

    const transcript = (response.results || [])
      .map((r) => r.alternatives?.[0]?.transcript || '')
      .filter(Boolean)
      .join('\n');

    res.json({ transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    res.status(500).json({ error: `Transcription failed: ${message}` });
  }
});

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running: http://localhost:${port}`);
});
