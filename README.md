# ALM - Audio Language Model (Website)

## Pages

- `index.html` – Home (Train / Analyze)
- `train.html` – Training page (opens after captcha login)
- `analyze.html` – Upload audio → convert to text

## Google Speech-to-Text (Required for Analyze)

This project uses **Google Cloud Speech-to-Text** via a small Node.js server endpoint (`/api/transcribe`).

### 1) Prerequisites

- Install Node.js (LTS)
- Create a Google Cloud project
- Enable **Cloud Speech-to-Text API**
- Create a **Service Account** and download its JSON key file

### 2) Set credentials (Windows PowerShell)

Set the environment variable to point to your downloaded service account key:

```powershell
$env:GOOGLE_APPLICATION_CREDENTIALS = "C:\path\to\service-account-key.json"
```

### 3) Install and run

From this folder:

```powershell
npm install
npm run start
```

Open:

- http://localhost:3000/

### Notes

- `analyze.html` currently supports **WAV** and **FLAC** uploads (minimal version).
- If you open the HTML files directly (without the server), analyze will fail because `/api/transcribe` won’t exist.
