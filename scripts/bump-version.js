// Incrementa buildRevision en metadata.json y actualiza buildTag (ISO 8601, UTC).
// Lo ejecuta el workflow de GitHub en cada push a main. Uso local: npm run version:bump
// buildRevision -1 => primer bump deja 0 => versión 1.0.0
const fs = require('fs')
const path = require('path')

const file = path.join(__dirname, '..', 'metadata.json')
const meta = JSON.parse(fs.readFileSync(file, 'utf8'))

meta.buildRevision = Number(meta.buildRevision) + 1
meta.buildTag = new Date().toISOString()

fs.writeFileSync(file, JSON.stringify(meta, null, 2) + '\n')
console.log('version ->', meta.buildMajor + '.' + meta.buildMinor + '.' + meta.buildRevision, '(' + meta.buildTag + ')')
