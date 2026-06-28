---
id: catalog-model
title: Catalog model
sidebar_position: 3
---

{/* migrated from range42-catalog/README.md (layer descriptions) + range42/GETTING_STARTED.md "Extend the scenarios" */}

The range42 catalog uses a **layered architecture** to separate concerns and keep reusable building blocks independent from the scenarios that consume them.

## The three layers

### Layer 02 — Ansible roles

Path in the catalog: `02_ansible_layer/`

Ansible roles act directly on VMs to configure their environment. Roles are grouped by target host category:

| Sub-directory | Target | Examples |
|---|---|---|
| `admin/roles/` | Admin VMs | Wazuh agent, Docker Compose, Headscale, Kong, NTP, user management |
| `trainee/roles/` | Trainee / student VMs | `blue_env`, `red_env`, `malware_env` bootstraps |
| `_ctf/cve/` | Vulnerable targets | CVE scenarios by technology (network, system, web) |
| `_ctf/malware/` | Vulnerable targets | Backdoor, keylogger, rootkit scenarios |
| `_ctf/misconfiguration/` | Vulnerable targets | Misconfiguration scenarios (network, system, web) |

Role naming convention: `<category>.<action>.<target>` (e.g., `software.install.wazuh`, `systems.checks.overview`).

### Layer 03 — Containers

Path in the catalog: `03_container_layer/`

Container-based deployments (Docker / Docker Compose / LXC) for vulnerable or misconfigured services. These complement the Ansible layer — a container stack can be deployed on top of a VM that was prepared by a Layer 02 role.

Categories mirror the Ansible layer: CVE scenarios, malware scenarios, misconfiguration scenarios, and a `hello/` smoke-test stack.

### Layer 04 — Gamification

Path in the catalog: `04_gamification_layer/`

Challenge frameworks and themed front-ends that wrap deployed vulnerabilities into a user-facing gamified experience. Examples include a fake hospital portal and a fake bank login — visually distinct themes placed on top of the same underlying vulnerable services.

Shared assets (CSS, i18n strings, skins) live under `web/shared/` so multiple themes can reuse them.

## How layers compose

A scenario (in [range42-playbooks](https://github.com/range42/range42-playbooks)) orchestrates all three layers:

1. **Stage 00** — create VMs on Proxmox (cloud-init templates).
2. **Stage 01** — apply Layer 02 Ansible roles to configure each VM.
3. **Stage 01+** — pull and start Layer 03 containers on the relevant VMs.
4. **Optional** — overlay Layer 04 gamification templates if the scenario calls for them.

This separation means you can swap a gamification theme without touching the underlying vulnerable service, or add a new CVE container without modifying any Ansible role.

## Extending scenarios

All deployable scenarios live in [range42-playbooks/scenarios](https://github.com/range42/range42-playbooks/tree/main/scenarios) — the list will grow over time.

To add new content to the catalog:

- **New Ansible role**: add it under the appropriate `02_ansible_layer/` sub-directory, following the `<category>.<action>.<target>` naming convention.
- **New container stack**: add a `docker-compose.yml` (and optional Dockerfile) under the matching `03_container_layer/docker/_ctf/<type>/` path.
- **New gamification theme**: add your HTML/PHP/Vue front-end under `04_gamification_layer/web/frameworks/` and reference shared assets from `web/shared/`.

**Want a specific product, CVE or misconfiguration added?** Open an issue on [range42-catalog](https://github.com/range42/range42-catalog/issues) — catalog requests are centralised there.
