/**
 * Local development API server.
 * Run alongside `vite dev` so that /api/* requests
 * (proxied by Vite) hit real handler functions.
 *
 *   Terminal 1:  npm run dev
 *   Terminal 2:  npm run dev:api
 */
import 'dotenv/config';
import express from 'express';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import rsvpHandler        from './api/rsvp.js';
import rsvpsHandler       from './api/rsvps.js';
import rsvpDeleteHandler  from './api/rsvp-delete.js';
import rsvpToggleHandler  from './api/rsvp-toggle.js';
import wishesHandler      from './api/wishes.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json());

app.get('/admin', (_req, res) => {
  res.sendFile(resolve(__dirname, 'public/admin/index.html'));
});

app.post('/api/rsvp',         (req, res) => rsvpHandler(req, res));
app.post('/api/rsvps',        (req, res) => rsvpsHandler(req, res));
app.post('/api/rsvp-delete',  (req, res) => rsvpDeleteHandler(req, res));
app.post('/api/rsvp-toggle',  (req, res) => rsvpToggleHandler(req, res));
app.get('/api/wishes',        (req, res) => wishesHandler(req, res));

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => console.log(`API dev server → http://localhost:${PORT}`));
