// Genera src/metadata.json con la versión y datos del build.
// Se ejecuta automáticamente en `npm start` (prestart) y `npm run build` (prebuild).
// En Vercel usa las variables VERCEL_* (commit, rama, entorno).
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')
const pkg = require('../package.json')

const git = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch (e) {
    return ''
  }
}

const env = process.env
const commit = (env.VERCEL_GIT_COMMIT_SHA || git('git rev-parse HEAD') || 'local').slice(0, 7)
const branch = env.VERCEL_GIT_COMMIT_REF || git('git rev-parse --abbrev-ref HEAD') || 'local'
const environment = env.VERCEL_ENV || (env.NODE_ENV === 'production' ? 'build' : 'development')

const metadata = {
  name: 'QR Generate - ALFAM Services',
  version: pkg.version,
  commit,
  branch,
  environment,
  builtAt: new Date().toISOString(),
}

fs.writeFileSync(
  path.join(__dirname, '..', 'src', 'metadata.json'),
  JSON.stringify(metadata, null, 2) + '\n'
)
console.log(
  'metadata.json -> v' + metadata.version + ' (' + metadata.branch + '@' + metadata.commit + ', ' + metadata.environment + ')'
)
