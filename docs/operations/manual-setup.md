---
id: manual-setup
title: Manual setup (advanced)
sidebar_position: 4
---

{/* migrated from range42/GETTING_STARTED.md "Manual setup (advanced)" */}

The wizard (`python3 range42-init.py`, covered in the [Install wizard](../getting-started/install-wizard.md))
is the recommended path. The manual flow below exists for users who want
to script the setup, integrate it in their own tooling, or simply understand
exactly what gets executed.

It runs the same 3 playbooks the wizard runs, in the same order, against an
inventory you write by hand from the `inventories/example/` template.

```bash
# 1. Copy the template inventory
cp -r inventories/example inventories/my-infra

# 2. Edit the 3 files below with your settings:
#    - inventories/my-infra/hosts.yml                            (Proxmox + deployer-cli connection)
#    - inventories/my-infra/group_vars/all/vars.yml              (infrastructure settings)
#    - inventories/my-infra/group_vars/demo_lab/vars.yml         (scenario settings)

# 3. Generate credentials (SSH keys, vault, passwords) - runs locally
ansible-playbook playbooks/01_generate_credentials.yml \
  -i inventories/my-infra/hosts.yml \
  -e @inventories/my-infra/group_vars/demo_lab/vars.yml \
  -e INFRASTRUCTURE_SCENARIO=demo_lab

# 4. Configure Proxmox (root key install, jump_user, API token, bridges, NAT)
ansible-playbook playbooks/02_configure_proxmox.yml \
  -i inventories/my-infra/hosts.yml \
  -e @inventories/my-infra/group_vars/demo_lab/vars.yml \
  -e INFRASTRUCTURE_SCENARIO=demo_lab

# 5. Deploy the deployer-cli (packages, repos, workspace, SSH config, range42-context)
ansible-playbook playbooks/03_deploy_deployer_cli.yml \
  -i inventories/my-infra/hosts.yml \
  -e @inventories/my-infra/group_vars/demo_lab/vars.yml \
  -e INFRASTRUCTURE_SCENARIO=demo_lab \
  --vault-password-file ./config/my-infra-demo_lab/secrets/vault_pass.txt

# 6. On the deployer-cli, use the workspace
range42-context use my-infra demo_lab
range42-context status
range42-context deploy
```

Note on `-e @...vars.yml`: this loads the scenario's group\_vars as extra vars.
Without it, Ansible silently ignores `inventories/<cn>/group_vars/<scenario>/vars.yml`
because no inventory group matches the scenario name, and role defaults would win.

Or run all three at once via `site.yml`:

```bash
ansible-playbook site.yml \
  -i inventories/my-infra/hosts.yml \
  -e @inventories/my-infra/group_vars/demo_lab/vars.yml \
  -e INFRASTRUCTURE_SCENARIO=demo_lab \
  --vault-password-file ./config/my-infra-demo_lab/secrets/vault_pass.txt
```
