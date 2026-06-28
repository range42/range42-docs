---
id: daily-operations
title: Project structure
sidebar_label: Project structure
sidebar_position: 3
---

{/* migrated from range42/GETTING_STARTED.md "Project structure" */}

The `range42` repo (the one you cloned in step 0) is laid out as follows:

```
range42/
├── range42-init.py           — setup wizard (Python/Textual TUI)
├── ansible.cfg
├── site.yml                  — runs all 3 playbooks in sequence
├── playbooks/
│   ├── 01_generate_credentials.yml
│   ├── 02_configure_proxmox.yml
│   └── 03_deploy_deployer_cli.yml
├── inventories/
│   └── example/              — copy and customize for your infra
├── roles/                    — 11 modular roles
└── config/                   — generated credentials (not committed)
```

The other 4 repos (`range42-playbooks`, `range42-catalog`,
`range42-ansible_roles-proxmox_controller`, `range42-ansible_roles-debug-devkit`)
are cloned by the wizard onto the deployer-cli during the deploy. You don't
need them on your operator machine.
