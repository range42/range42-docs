# range42-docs

Public documentation for [Range42](https://range42.lu) — an open-source cyber range
platform — built with [Docusaurus](https://docusaurus.io). Live at <https://docs.range42.lu>.

## Local development

```bash
npm ci
npm start            # dev server at http://localhost:3000
npm run build        # static build into ./build
npm run serve        # serve the built site locally
```

## Contributing

Edit Markdown under `docs/`, preview locally, open a PR into `main`. Merges auto-deploy
to GitHub Pages. See [CONTRIBUTING.md](CONTRIBUTING.md).

## Releasing a version

```bash
npm run docusaurus docs:version vX.Y
```

Then add the new version to the `versions` map in `docusaurus.config.js` (path `X.Y`),
set it as `lastVersion`, and bump the `/docs/X.Y/` links in `src/pages/index.js` and the
footer.

## License

GPL-3.0
