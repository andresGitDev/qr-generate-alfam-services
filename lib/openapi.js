'use strict';

const { MAX_CONTENT } = require('./qr');

const errorRef = { $ref: '#/components/schemas/ErrorResponse' };
const err = (description) => ({ description, content: { 'application/json': { schema: errorRef } } });

const spec = {
  openapi: '3.0.3',
  info: {
    title: 'QR Generate - ALFAM Services',
    version: '1.1.0',
    description: 'Genera la imagen de un codigo QR (SVG o PNG) a partir de un texto o una URL.',
  },
  servers: [{ url: '/' }],
  tags: [{ name: 'QR', description: 'Generacion de codigos QR' }],
  paths: {
    '/api/qr': {
      get: {
        tags: ['QR'],
        summary: 'Genera la imagen de un QR',
        parameters: [
          { name: 'content', in: 'query', required: true, description: `Texto o URL a codificar (maximo ${MAX_CONTENT} caracteres)`, schema: { type: 'string', maxLength: MAX_CONTENT }, example: 'https://ejemplo.com' },
          { name: 'format', in: 'query', description: 'Formato de salida', schema: { type: 'string', enum: ['svg', 'png'], default: 'svg' } },
          { name: 'size', in: 'query', description: 'Lado de la imagen en px', schema: { type: 'integer', minimum: 64, maximum: 1024, default: 256 } },
          { name: 'margin', in: 'query', description: 'Margen en modulos', schema: { type: 'integer', minimum: 0, maximum: 10, default: 2 } },
          { name: 'level', in: 'query', description: 'Correccion de errores', schema: { type: 'string', enum: ['L', 'M', 'Q', 'H'], default: 'M' } },
          { name: 'color', in: 'query', description: 'Color del QR (hexadecimal de 3 o 6 digitos)', schema: { type: 'string', default: '000000' }, example: '1a1a1a' },
          { name: 'background', in: 'query', description: 'Color de fondo (hexadecimal)', schema: { type: 'string', default: 'ffffff' } },
        ],
        responses: {
          200: {
            description: 'Imagen del QR (cache de 1 dia)',
            content: {
              'image/svg+xml': { schema: { type: 'string' } },
              'image/png': { schema: { type: 'string', format: 'binary' } },
            },
          },
          400: err('Parametro invalido o faltante'),
          405: err('Metodo no permitido (solo GET)'),
          500: err('Error interno'),
        },
      },
    },
  },
  components: {
    schemas: {
      ErrorResponse: {
        type: 'object',
        properties: {
          timestamp: { type: 'string', format: 'date-time' },
          status: { type: 'integer', example: 400 },
          code: { type: 'string', example: 'VALIDACION_FALLIDA' },
          message: { type: 'string' },
          path: { type: 'string', example: '/api/qr' },
          traceId: { type: 'string' },
          errors: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
};

const docsHtml = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>QR Generate - ALFAM Services · API</title>
<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui.css">
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.17.14/swagger-ui-bundle.js"></script>
<script>window.ui = SwaggerUIBundle({ url: '/openapi.json', dom_id: '#swagger-ui', deepLinking: true });</script>
</body>
</html>`;

function sendOpenapi(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.end(JSON.stringify(spec));
}

function sendDocs(req, res) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=300');
  res.end(docsHtml);
}

module.exports = { spec, sendOpenapi, sendDocs };
