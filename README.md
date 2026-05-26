# Marketing Guru – BottleDROP CRM

CRM och utskicksverktyg för BottleDROP Ge Pant pilotlansering.

## Kom igång lokalt

```bash
npm install
npm run dev
```

Öppna http://localhost:5173

## Deploya till Vercel

### Alternativ 1 – Via Vercel GUI (enklast)

1. Pusha koden till GitHub
2. Gå till [vercel.com](https://vercel.com) → **Add New Project**
3. Importera din GitHub-repo
4. Inställningar: Framework = **Vite**, allt annat default
5. Klicka **Deploy** – klart på ~30 sekunder

### Alternativ 2 – Via Vercel CLI

```bash
npm install -g vercel
vercel
```

## Struktur

```
marketing-guru/
├── index.html          # Entry HTML
├── src/
│   ├── main.jsx        # React root mount
│   └── App.jsx         # Hela appen (en fil)
├── package.json
└── vite.config.js
```

## Teknik

- **React 18** + **Vite 5**
- Inga externa CSS-bibliotek – inline styles
- **Brevo API** för e-postutskick
- **Anthropic API** för AI-mallgenerering
- Data sparas i **localStorage** (persistent i webbläsaren)

## Miljövariabler (valfritt)

Skapa `.env.local` för att förinställa API-nycklar:

```
VITE_BREVO_API_KEY=xkeysib-...
VITE_SENDER_EMAIL=din@epost.se
VITE_SENDER_NAME=Marketing Guru
```
