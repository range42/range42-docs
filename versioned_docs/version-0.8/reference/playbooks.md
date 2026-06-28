---
id: playbooks
title: Playbooks
sidebar_position: 4
---

{/* migrated from range42-playbooks/README.md */}

Ansible playbooks and scenarios for deploying cyber range environments on Proxmox.
Part of the [range42](https://github.com/range42/range42) platform.

## How it works

A **scenario** is a complete lab environment — it defines which VMs to create, what software to install on each, and how to configure them. You deploy a scenario with one command, iterate on individual VMs during development, and tear it all down when you're done.

```
scenario (demo_lab)
├── 01_init_proxmox         ← create VM templates (cloud-init)
├── 02_admin_infrastructure ← deploy admin VMs (wazuh, kong, docker, UI/API)
│   ├── stage_00            ← create VMs (Proxmox API + cloud-init)
│   ├── stage_01            ← install software (Ansible roles from catalog)
│   └── stage_02            ← post-install configuration (optional)
├── 03_student_infrastructure ← deploy student workstations
│   ├── stage_00
│   └── stage_01
└── 04_ctf_infrastructure   ← deploy vulnerable boxes (CTF targets)
    ├── stage_00
    └── stage_01
```

**Stages** are ordered deployment phases within each infrastructure section. They separate concerns and allow partial re-runs — you can replay `stage_01` (software install) without recreating the VM from `stage_00`.

Each stage contains:
- `*.yml` — Ansible playbooks (executed by the scenario's `_main.yml`)
- `*.devkit/` — per-VM shell scripts for manual testing (install, snapshot, revert)

## Available scenarios

| Scenario | Status | Description | Details |
|----------|--------|-------------|---------|
| `demo_lab` | **functional** | Full cyber range — admin, student, CTF infrastructure | [README](https://github.com/range42/range42-playbooks/tree/main/scenarios/demo_lab) |
| `_init_lab` | **functional** | Shared init — VM templates + init VMs | [README](https://github.com/range42/range42-playbooks/tree/main/scenarios/_init_lab) |
| `forensics_lab` | coming soon | Forensics training | |
| `kunai_lab` | coming soon | Kunai-based detection lab | |
| `misp_lab` | coming soon | MISP threat intel lab | |

Other scenario directories are placeholders — new scenarios are actively being developed.

## Bundles (work in progress)

Bundles are **reusable, atomic actions** — the building blocks that the [backend API](https://github.com/range42/range42-backend-api) and [deployer UI](https://github.com/range42/range42-deployer-ui) use to trigger deployments from the web interface.

Instead of running a full scenario from the CLI, the UI picks individual bundles (create VMs, install software, snapshot, revert) and composes them on the fly.

:::note
Bundles are under active development. Scenarios currently contain their own playbooks directly. Once bundles are stable, scenarios will reference them instead of duplicating logic.
:::

### Current bundle structure

```text
bundles/
├── core/
│   ├── proxmox/configure/default/vms/
│   │   ├── create-vms-admin/
│   │   ├── create-vms-student/
│   │   ├── create-vms-vuln/
│   │   ├── delete-vms-admin/
│   │   ├── delete-vms-student/
│   │   ├── delete-vms-vuln/
│   │   ├── start-stop-pause-resume-vms-admin/
│   │   ├── start-stop-pause-resume-vms-student/
│   │   ├── start-stop-pause-resume-vms-vuln/
│   │   └── snapshot/
│   │       ├── create-vms-{admin,student,vuln}/
│   │       └── revert-vms-{admin,student,vuln}/
│   └── linux/ubuntu/
│       ├── configure/add-user/
│       └── install/{basic-packages,docker,docker-compose,dot-files}/
└── ping/                     # Connectivity test
```

## Repository structure

```text
scenarios/
├── demo_lab/                          # Reference scenario (functional)
│   ├── main.yml                       # Full deploy entry point
│   ├── main_vms_only.yml              # Fast redeploy (skip templates)
│   ├── 01_init_proxmox/              # VM templates (cloud-init)
│   ├── 02_admin_infrastructure/       # Admin VMs — stage_00, stage_01, stage_02
│   ├── 03_student_infrastructure/     # Student VMs — stage_00, stage_01
│   ├── 04_ctf_infrastructure/         # CTF VMs — stage_00, stage_01
│   ├── inventory/                     # Scenario-specific inventory
│   ├── secrets/                       # Symlink → workspace secrets (gitignored)
│   └── demo_lab.*.sh                 # Deploy, delete, reset scripts
├── forensics_lab/                     # Placeholder
├── kunai_lab/                         # Placeholder
├── misp_lab/                          # Placeholder
└── _init_lab/                         # Shared init playbooks

bundles/                               # Reusable actions (work in progress)
├── core/proxmox/                      # VM lifecycle bundles
├── core/linux/ubuntu/                 # OS-level bundles
└── ping/                              # Connectivity test
```

## Secrets

The `secrets/` directory in each scenario is a symlink to the workspace secrets (`~/range42.config/<codename>-<scenario>/secrets/`). It contains vault files and is gitignored — never committed.

## Source

Repository: [range42/range42-playbooks](https://github.com/range42/range42-playbooks)
