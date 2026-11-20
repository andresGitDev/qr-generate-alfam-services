'use strict';

// Funcion serverless de Vercel: GET /api/qr?content=...&format=svg|png (ver README).
const { handle } = require('../lib/qr');

module.exports = handle;
