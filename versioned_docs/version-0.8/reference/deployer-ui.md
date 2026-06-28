---
id: deployer-ui
title: Deployer UI
sidebar_position: 2
---

{/* migrated from range42-deployer-ui/README.md — public-facing sections only */}

**range42-deployer-ui** is a web application for visually orchestrating and managing infrastructure through an intuitive interface powered by [VueFlow](https://vueflow.dev/). It lets you build, configure, and deploy complex infrastructure systems using a node-based visual editor.

## Node-based infrastructure design

Users interact with a canvas where each node represents a component of the infrastructure (networks, VMs, Docker containers, etc.). Each node's behaviour and configuration depend on its type:

- **Settings**: nodes require user input to define parameters essential for backend deployment.
- **Status indicators**: each node shows a coloured badge at a glance:
  - **Gray** — incomplete / missing required configuration.
  - **Orange** — ready to deploy.
  - **Red** — deployment error or misconfiguration.
  - **Green** — successfully deployed.

## UI/UX principles

- Built on **VueFlow** for seamless node manipulation and interactions.
- Uses **DaisyUI** for styling and component consistency.
- Designed with clarity, responsiveness, and accessibility in mind.

## Data management

The application uses **localStorage** to store and manage local project data directly in the browser, enabling quick access and offline capabilities. Future versions will integrate SQLite WASM for more robust data persistence.

## Project structure and data scope

- Each **Project** corresponds to a VueFlow workspace and is stored as a JSON object.
- Projects include all configuration data needed to build and deploy infrastructure.
- A **shared inventory system** exists across all projects, containing pre-made, pre-configured components (base Docker images, VM templates, network presets) for reuse and standardisation.

## Key features

- Visual drag-and-drop interface to define and manage infrastructure.
- Per-node configuration system with validation.
- Deployment tracking and feedback via status indicators.
- Persistent local storage using localStorage.
- Project isolation with shared global data for reusability.
- Sidebar navigation with responsive design.
- Multi-language support (English, French, Japanese).

## Running with Docker

The easiest way to self-host the deployer UI:

```bash
cp .env.example .env
docker compose up --build
```

The UI is available at `http://localhost:3000` (configurable via `UI_PORT` in `.env`).

Configure the backend API URL in the settings modal once the app is running.

## Source

Repository: [range42/range42-deployer-ui](https://github.com/range42/range42-deployer-ui)
