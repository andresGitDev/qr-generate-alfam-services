'use strict';

const crypto = require('crypto');
const QRCode = require('qrcode');

const MAX_CONTENT = 1000;
const MIN_SIZE = 64;
const MAX_SIZE = 1024;
const MAX_MARGIN = 10;
const LEVELS = ['L', 'M', 'Q', 'H'];
const FORMATS = { svg: 'image/svg+xml', png: 'image/png' };
const HEX = /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

class QrError extends Error {
  constructor(status, code, message) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

function first(value) {
  return Array.isArray(value) ? value[0] : value;
}

function intParam(query, name, def, min, max) {
  const raw = first(query[name]);
  if (raw === undefined || raw === '') return def;
  if (!/^\d+$/.test(String(raw))) throw new QrError(400, 'VALIDACION_FALLIDA', `El parametro ${name} debe ser un numero entero`);
  const n = Number(raw);
  if (n < min || n > max) throw new QrError(400, 'VALIDACION_FALLIDA', `El parametro ${name} debe estar entre ${min} y ${max}`);
  return n;
}

function colorParam(query, name, def) {
  const raw = first(query[name]);
  if (raw === undefined || raw === '') return def;
  if (!HEX.test(raw)) throw new QrError(400, 'VALIDACION_FALLIDA', `El parametro ${name} debe ser un color hexadecimal (ej. 000000)`);
  return raw.startsWith('#') ? raw : `#${raw}`;
}

/** Valida la query y devuelve las opciones; lanza QrError(400) si algo es invalido. */
function parseQuery(query) {
  const content = first(query.content);
  if (content === undefined || String(content).trim() === '') {
    throw new QrError(400, 'VALIDACION_FALLIDA', 'El parametro content es obligatorio');
  }
  if (String(content).length > MAX_CONTENT) {
    throw new QrError(400, 'VALIDACION_FALLIDA', `El parametro content no puede superar ${MAX_CONTENT} caracteres`);
  }
  const format = String(first(query.format) || 'svg').toLowerCase();
  if (!FORMATS[format]) throw new QrError(400, 'VALIDACION_FALLIDA', 'El parametro format debe ser svg o png');
  const level = String(first(query.level) || 'M').toUpperCase();
  if (!LEVELS.includes(level)) throw new QrError(400, 'VALIDACION_FALLIDA', 'El parametro level debe ser L, M, Q o H');
  return {
    content: String(content),
    format,
    level,
    size: intParam(query, 'size', 256, MIN_SIZE, MAX_SIZE),
    margin: intParam(query, 'margin', 2, 0, MAX_MARGIN),
    color: colorParam(query, 'color', '#000000'),
    background: colorParam(query, 'background', '#ffffff'),
  };
}

async function render(opts) {
  const common = {
    errorCorrectionLevel: opts.level,
    margin: opts.margin,
    color: { dark: opts.color, light: opts.background },
  };
  if (opts.format === 'png') {
    return QRCode.toBuffer(opts.content, { ...common, type: 'png', width: opts.size });
  }
  return QRCode.toString(opts.content, { ...common, type: 'svg', width: opts.size });
}

function sendError(res, req, err) {
  const known = err instanceof QrError;
  const status = known ? err.status : 500;
  const traceId = crypto.randomUUID();
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('X-Trace-Id', traceId);
  res.end(JSON.stringify({
    timestamp: new Date().toISOString(),
    status,
    code: known ? err.code : 'ERROR_INTERNO',
    message: known ? err.message : 'No se pudo generar el QR. Reintenta en unos minutos.',
    path: (req.url || '').split('?')[0],
    traceId,
    errors: [],
  }));
}

async function handle(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET, OPTIONS');
      throw new QrError(405, 'METODO_NO_PERMITIDO', 'Solo se admite GET');
    }
    const url = new URL(req.url, 'http://localhost');
    const query = Object.fromEntries(url.searchParams.entries());
    const opts = parseQuery(query);
    const body = await render(opts);
    res.statusCode = 200;
    res.setHeader('Content-Type', FORMATS[opts.format]);
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=86400');
    res.end(body);
  } catch (err) {
    if (!(err instanceof QrError)) console.error('Error generando QR:', err.message);
    sendError(res, req, err);
  }
}

module.exports = { handle, parseQuery, render, QrError, MAX_CONTENT };
