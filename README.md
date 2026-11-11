# QR Generate - ALFAM Services

Generador de códigos QR a partir de una **URL** o un **texto**, con interfaz estilo Swagger.

- **Producción:** https://qr-generate-alfam-services.vercel.app
- **Repositorio:** https://github.com/andresGitDev/qr-generate-alfam-services
- **Ramas:** `main` (producción, despliegue automático) y `develop` (trabajo / previews)

Proyecto creado con [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

## Despliegue en Vercel

Aplicación Create React App (sitio estático), sin variables de entorno requeridas.

- Configuración: `vercel.json` (preset `create-react-app`, salida `build`, rewrite SPA a `index.html`) y `.vercelignore`.
- Producción: https://qr-generate-alfam-services.vercel.app (proyecto `qr-generate-alfam-services` en Vercel, preset `Create React App`, Root Directory `./`, sin variables de entorno).
- Ramas: `main` = producción (deploy automático en cada push). `develop` = trabajo / deploys de preview:
  `git checkout -b develop && git push -u origin develop`. Para publicar, merge a `main`.
- Opcional: en Settings → Git → Ignored Build Step: `[ "$VERCEL_GIT_COMMIT_REF" != "main" ]` para que solo `main` despliegue.

## Metadata de versión

La versión vive en `metadata.json` (raíz):

```json
{ "buildMajor": 1, "buildMinor": 0, "buildRevision": -1, "buildTag": "2026-11-11T18:54:51.000-03:00" }
```

- Versión = `buildMajor.buildMinor.buildRevision`. Con `buildRevision: -1` aún no hay versión publicada (se muestra `1.0.0-pre`); el primer push a `main` la deja en `1.0.0`.
- `buildTag` es la fecha de compilación en hora de Argentina con offset (ISO 8601, p. ej. `2026-11-11T19:02:10.123-03:00`), sin importar la zona del runner.
- En cada push a `main`, el workflow `.github/workflows/bump-version.yml` ejecuta `scripts/bump-version.js` (suma 1 a `buildRevision`, actualiza `buildTag`) y commitea `chore(version): vX.Y.Z`.
- `vercel.json` (`ignoreCommand`) omite el deploy del commit original en `main` y despliega solo el commit de versión, así cada deploy de producción sale con la versión nueva. Otras ramas despliegan normal (preview).
- `scripts/generate-metadata.js` (prestart/prebuild) lee `metadata.json` y genera `src/build-info.json` (no versionado) con la versión, commit, rama y entorno que muestra la UI.
- Para subir major/minor, editá `buildMajor`/`buildMinor` y poné `buildRevision` en `-1`.
- Bump manual local: `npm run version:bump`.
