'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { handle } = require('../lib/qr');

function call(url, method = 'GET') {
  return new Promise((resolve) => {
    const headers = {};
    const res = {
      statusCode: 200,
      setHeader: (k, v) => { headers[k.toLowerCase()] = v; },
      end: (body) => resolve({ status: res.statusCode, headers, body }),
    };
    handle({ url, method }, res);
  });
}

test('devuelve un SVG por defecto', async () => {
  const r = await call('/api/qr?content=hola');
  assert.equal(r.status, 200);
  assert.equal(r.headers['content-type'], 'image/svg+xml');
  assert.match(r.body, /<svg/);
  assert.match(r.headers['cache-control'], /max-age/);
});

test('devuelve un PNG valido', async () => {
  const r = await call('/api/qr?content=hola&format=png&size=200&color=ff0000');
  assert.equal(r.status, 200);
  assert.equal(r.headers['content-type'], 'image/png');
  assert.equal(r.body.subarray(1, 4).toString(), 'PNG');
});

test('content faltante da 400 con el contrato de error', async () => {
  const r = await call('/api/qr');
  const e = JSON.parse(r.body);
  assert.equal(r.status, 400);
  assert.equal(e.status, 400);
  assert.equal(e.code, 'VALIDACION_FALLIDA');
  assert.equal(e.path, '/api/qr');
  assert.ok(e.traceId && e.timestamp && Array.isArray(e.errors));
  assert.ok(r.headers['x-trace-id']);
});

test('parametros invalidos dan 400', async () => {
  for (const q of ['content=a&format=gif', 'content=a&size=10', 'content=a&size=abc', 'content=a&color=zzz',
    'content=a&level=X', 'content=a&margin=99', `content=${'a'.repeat(1001)}`]) {
    const r = await call(`/api/qr?${q}`);
    assert.equal(r.status, 400, q);
  }
});

test('metodo distinto de GET da 405 y OPTIONS 204', async () => {
  assert.equal((await call('/api/qr?content=a', 'POST')).status, 405);
  assert.equal((await call('/api/qr', 'OPTIONS')).status, 204);
});
