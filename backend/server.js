// server.js
// This is the entry point of the backend — the file you run to
// start everything. Its only jobs right now: create an Express
// app, add two pieces of middleware, define one test route, and
// start listening for requests. Real feature routes (auth,
// routines, diary, etc.) will get imported in here later, one
// module at a time — this file should stay small.
 
require('dotenv').config(); // reads .env and adds its values to process.env
 
const express = require('express');
const cors = require('cors');
 
const app = express();
 
// ----- Middleware -----
// Middleware = functions that run on EVERY request before it
// reaches your route handlers. Order matters — they run top to
// bottom, in the order you .use() them.
 
app.use(cors());          // allow the frontend (different origin) to call this API
app.use(express.json());  // parse incoming JSON request bodies into req.body automatically
 
// ----- Routes -----
// A simple test route to prove the server is alive and responding.
// This is NOT a real feature — just a health check.
app.get('/api/health-check', (req, res) => {
  res.json({ status: 'ok', message: 'DailyTrack backend is running.' });
});
 
// ----- Start the server -----
const PORT = process.env.PORT || 5000;
 
app.listen(PORT, () => {
  console.log(`DailyTrack backend listening on http://localhost:${PORT}`);
});