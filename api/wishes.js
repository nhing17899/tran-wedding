import { connectDB, RSVP } from '../lib/db.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).end();

  const { location } = req.query ?? {};
  const validLocations = ['vietnam', 'hungary'];
  const locationFilter = validLocations.includes(location) ? { location } : {};

  try {
    await connectDB();
    console.log('[wishes] DB connected, querying...');
    const wishes = await RSVP.find(
      { message: { $ne: '' }, greetingEnabled: true, ...locationFilter },
      { name: 1, message: 1, location: 1, submittedAt: 1, greetingEnabled: 1, _id: 0 }
    ).sort({ submittedAt: -1 }).lean();
    console.log(`[wishes] Found ${wishes.length} wishes:`, wishes.map(w => ({ name: w.name, msg: w.message?.slice(0, 30), greetingEnabled: w.greetingEnabled })));
    res.json({ ok: true, wishes });
  } catch (err) {
    console.error('Wishes fetch error:', err);
    res.status(500).json({ ok: false, error: 'Failed to fetch wishes.' });
  }
}
