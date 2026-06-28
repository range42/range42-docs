---
id: architecture
title: Architecture
sidebar_position: 2
---

{/* migrated from range42/README.md "Architecture overview" + "The stack" */}

## Architecture overview

A range42 deployment can be driven in two complementary ways:

**Web UI path** (visual, recommended for day-to-day operations):

```
  ┌─ range42-deployer-ui (Vue 3 + VueFlow) ──────────────────┐
  │  Visual topology canvas — drag-and-drop lab design        │
  └──────────────────────────┬───────────────────────────────┘
                             │ REST + WebSocket
  ┌──────────────────────────▼───────────────────────────────┐
  │  range42-api-gw (Kong gateway)                           │
  │  Auth, ACLs, rate-limiting                               │
  └──────────────────────────┬───────────────────────────────┘
                             │
  ┌──────────────────────────▼───────────────────────────────┐
  │  range42-backend-api (FastAPI)                           │
  │  80 REST endpoints + /ws/status stream                   │
  └──────────┬───────────────────────┬───────────────────────┘
             │                       │
  range42-playbooks          range42-catalog
  (scenarios + bundles)      (roles, Docker, CTF content)
             │
             ▼
  [ Proxmox VE cluster ]
  VMs, LXC, networks
```

**CLI path** (direct, for advanced/scripted use):

```
  [ deployer-cli (range42-context) ]
     │
     ├─ runs the setup wizard
     ├─ holds inventory + credentials
     └─ drives Ansible playbooks directly
             │
             ▼
  [ Proxmox VE cluster ]
  VMs, LXC, networks
```

Both paths converge on the same Proxmox infrastructure and Ansible playbooks — the web UI simply adds a visual layer and a managed API on top.

The **deployer-cli** is your local machine by default, or a dedicated pivot VM if you manage multiple Proxmox infrastructures from one place.

Today, the **lab VMs on Proxmox** are generally organised into 3 host groups (this is the convention used by current scenarios and may evolve as new ones are added):

| Group | Purpose | Required |
|-------|---------|----------|
| **Vulnerable targets** | Core lab systems for attack and analysis | Yes |
| **Administration** | Monitoring, orchestration, supervision | No |
| **Student / Training** | Workstations for learners | No |

Only the vulnerable hosts group is required — admin and student groups are optional and can be disabled to save resources.

## The stack

In its recommended configuration, range42 relies on:

- **Proxmox** — hypervisor for virtual machines (mandatory)
- **Ansible** — provisioning and orchestration (mandatory)
- **Docker / LXC** — containerized services and vulnerable stacks (recommended)
- **Wazuh** — security monitoring and detection (optional)
- **Firewalls / VPN** — network segmentation and access control (recommended)
- **Vue.js / FastAPI / Kong** — web UI and API layer (available)
