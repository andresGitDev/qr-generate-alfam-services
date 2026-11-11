// Lee metadata.json (fuente de la versión) y genera src/build-info.json para la UI.
// Se ejecuta en `npm start` (prestart) y `npm run build` (prebuild). NO incrementa la versión:
// eso lo hace scripts/bump-version.js desde el workflow de GitHub en cada push a main.
const fs = require('fs')
const path = require('path')
const { execSync } = require('child_process')

const git = (cmd) => {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch (e) {
    return ''
  }
}

const root = path.join(__dirname, '..')
const meta = JSON.parse(fs.readFileSync(path.join(root, 'metadata.json'), 'utf8'))
const env = process.env

const revision = Number(meta.buildRevision)
const base = meta.buildMajor + '.' + meta.buildMinor + '.' + Math.max(revision, 0)

const info = {
  name: 'QR Generate - ALFAM Services',
  // revision -1 = todavía no se publicó ninguna versión desde main
  version: revision < 0 ? base + '-pre' : base,
  buildTag: meta.buildTag,
  commit: (env.VERCEL_GIT_COMMIT_SHA || git('git rev-parse HEAD') || 'local').slice(0, 7),
  branch: env.VERCEL_GIT_COMMIT_REF || git('git rev-parse --abbrev-ref HEAD') || 'local',
  environment: env.VERCEL_ENV || (env.NODE_ENV === 'production' ? 'build' : 'development'),
}

fs.writeFileSync(path.join(root, 'src', 'build-info.json'), JSON.stringify(info, null, 2) + '\n')
console.log('build-info.json -> v' + info.version + ' (' + info.branch + '@' + info.commit + ', ' + info.environment + ')')
