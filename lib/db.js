import mongoose from 'mongoose';

// Cache the connection across serverless invocations (warm starts reuse it)
let cached = globalThis._mongoose ?? (globalThis._mongoose = { conn: null, promise: null });

export async function connectDB() {
  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) throw new Error('Missing MONGODB_URI environment variable');

  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, { bufferCommands: false });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

const rsvpSchema = new mongoose.Schema({
  location:        { type: String, enum: ['vietnam', 'hungary'], required: true },
  name:            { type: String, required: true, trim: true },
  message:         { type: String, trim: true, default: '' },
  attendCeremony:  { type: Boolean, default: null },
  attendDinner:    { type: Boolean, default: null },  // Hungary only
  extraGuests:     { type: Number,  default: 0 },      // Hungary only
  submittedAt:     { type: Date,    default: Date.now },
  greetingEnabled: { type: Boolean, default: false },  // admin-controlled visibility on main page
});

export const RSVP = mongoose.models.RSVP || mongoose.model('RSVP', rsvpSchema);
