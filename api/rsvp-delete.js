import { connectDB, RSVP } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { passcode, id } = req.body ?? {};
  if (!passcode || passcode !== process.env.ADMIN_PASSCODE) {
    return res.status(401).json({ error: 'Invalid passcode.' });
  }
  if (!id) return res.status(400).json({ error: 'Missing id.' });

  try {
    await connectDB();
    const result = await RSVP.findByIdAndDelete(id);
    if (!result) return res.status(404).json({ ok: false, error: 'RSVP not found.' });
    res.json({ ok: true });
  } catch (err) {
    console.error('RSVP delete error:', err);
    res.status(500).json({ ok: false, error: 'Failed to delete.' });
  }
}
