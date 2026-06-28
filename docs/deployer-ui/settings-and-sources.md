---
id: settings-and-sources
title: Settings and sources
sidebar_position: 6
---

This page covers the Settings panel and the Git Sources page, then a self-hosting
section for administrators standing up the Deployer UI. Settings and sources are where
you tell the UI who you are, which backend to deploy through, and which git repositories
to read catalogs from and write projects to.

## Settings panel

The Settings panel lives at `/settings` (the gear in the app). Each card below controls
one area. Most values are stored in your browser; the exceptions are called out.

### Appearance

Pick the editor theme: Light, Dark, or Cupcake. This only changes how the UI looks.

### User identity

Set a display name and a color. The display name is written into the project `.lock`
stamp and into git commit metadata, so collaborators can see who is editing a project.
The color identifies you in collaborative views. Set both before you start editing shared
projects. The display name is validated (alphanumeric plus dashes), and the color must be
a valid color value.

### Backend API hosts

Register one or more backend-api endpoints. Each host has:

- A **label** (a short name such as `lab`).
- A **backend URL** (must start with `http://` or `https://`, for example
  `http://10.0.0.10:8000`).
- A **Proxmox node** name (the single Proxmox node that backend deploys to, default
  `pve`).
- An optional **bearer token**, used only when the backend sits behind a Kong gateway
  that requires authentication. Leave it empty for an unauthenticated backend.

Use **Test** on a registered host to check it. The result shows the health status (`ok`,
`degraded`, or `unreachable`) and the round-trip time in milliseconds. You can edit or
remove hosts. A project picks one of these hosts at deploy time, so register at least one
before deploying. Proxmox credentials and routing are configured on the backend itself,
not here; the UI only reads the Proxmox node list from the backend.

### Snapshot retention

Set the defaults for new deployments: keep at least the last N snapshots, and keep any
snapshot taken in the last D days. When you save, the UI sends these to the backend so it
can enforce them on the snapshot pipeline. If the backend is reachable the values are
synced (you see a "Synced to backend" note); if it is unreachable they are saved locally
as a fallback ("Local only"). Per-deployment overrides live on the deployment page.

### GitHub authentication

Connect a GitHub account with a Personal Access Token. A fine-grained token with
**Contents: Read-only** on the repositories you need is enough to browse and read private
inventory repositories. The token is validated against GitHub and stored locally in your
browser; it is never sent to Range42 servers. Once connected, the card shows the
authenticated GitHub user, and you can disconnect at any time.

This GitHub connection is used by the inventory-repositories feature below. For the
broader Catalog sources (including GitLab and Gitea), use the Git Sources page described
later on this page.

### Inventory repositories

Add a GitHub repository that holds infrastructure templates. Enter it as `owner/repo` or
as a full URL. The repository must contain a `manifest.json` file. For each registered
repo the card shows the branch, the component count from the manifest, and a `write`
badge when you have write access; you can refresh or remove it. To read private repos,
connect GitHub authentication first.

### Editor

Editor preferences:

- **Auto-save projects** — toggle automatic saving as you edit.
- **Snap to grid** — toggle snapping nodes to the grid on the canvas.
- **Grid size** — the grid spacing in pixels.

### Data management

Shows how many projects you have and how much browser storage they use. The danger zone
holds **Clear All Data**, which deletes all projects and settings from your browser. This
cannot be undone.

## Git Sources

The Git Sources page lives at `/sources`. Sources are the git repositories the UI reads
catalog entries from and writes projects to. They feed the [Catalog](./catalog.md): each
catalog entry comes from one of the sources you register here.

### Registering a source

Open **Add source**. The dialog has three tabs:

- **Paste URL** — paste a repository URL (for example `https://github.com/acme/lab`).
  The provider is detected from the URL and the source is added with no token.
- **OAuth** — a browser OAuth flow is out of scope in this build; choosing a provider
  here sends you to the self-hosted tab to enter a token instead.
- **Self-hosted** — pick the provider (GitLab, Gitea, GitHub, or a generic git host),
  enter the base URL (for example `https://gitea.example.com`), and optionally a token.
  **Test connection** probes the host and reports the round-trip time on success.

### Tokens, health, and write access

Each source can carry a Personal Access Token. Tokens are stored locally in your browser
and are used to authenticate reads and writes against the provider. Use the row's
rotate-token action to replace a token without removing the source.

Each source row shows a health badge (`ok` or `down`) from the last check; use the
refresh action to re-check. When the UI can confirm push permission on the source's
primary repository, the row also shows a write-access indicator. Removing a source takes
it (and its catalog entries) out of the Catalog.

The scopes a token needs depend on the provider:

- **GitHub** — a `repo` scope (or a fine-grained token with read and write on contents)
  for full read/write; read-only browsing needs only Contents read.
- **GitLab** — the `api` scope, or the narrower pair `read_repository` plus
  `write_repository`.
- **Gitea** — the `repo` scope (read and write to repositories and contents).

## Self-hosting

The Deployer UI is a static single-page application served by nginx. The repository ships
a `Dockerfile` and a `docker-compose.yml` so you can build and run it with one command.

### Quick start

```bash
cp .env.example .env
docker compose up --build
```

This builds the production bundle and serves it with nginx on container port 80, published
on the host port `UI_PORT` (default `3000`). Once it is up, browse to
`http://localhost:3000`. The container has a healthcheck against `/health`, which returns
`ok`.

### Ports and the backend URL

Two environment variables matter, and they behave differently:

- `UI_PORT` — the host port the web interface is published on (default `3000`). Change it
  in `.env` to serve the UI on a different port.
- `VITE_API_URL` — the backend base URL used by the **Vite dev server only** (defaults to
  `http://127.0.0.1:8000`). In dev, the UI makes relative `/v1/*` requests and Vite
  proxies them to this URL.

In the Docker/nginx production image, `VITE_API_URL` is ignored. The shipped nginx
configuration serves the static SPA, exposes `/health`, and applies caching and security
headers; it does **not** proxy `/v1/*` to a backend. In production the UI reaches the
backend through the absolute backend URL you register under **Settings → Backend API
hosts**, so each user points the UI at a backend from the Settings panel rather than
through an nginx upstream. (The relative `/v1/*` calls some pages attempt — for example
the best-effort source sync — only resolve when a dev proxy is present, and degrade
gracefully when it is not.)

### Token model

Git provider tokens are not read from environment variables. The `.env.example` entries
for GitHub, GitLab, and Gitea tokens are reference documentation for the scopes each
provider needs; they are not loaded at runtime. Real tokens are entered in the UI on the
`/sources` page (and the GitHub PAT in Settings) and are stored in the browser's
localStorage. Do not paste live secrets into `.env`, and do not commit your local env file.

### After the container is up

Configure at least one backend in **Settings → Backend API hosts** (see the
[Backend API hosts](#backend-api-hosts) section above) so projects have a backend to
deploy through, then register your Git Sources so the Catalog has entries to work from.
