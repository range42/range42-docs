---
id: first-deployment
title: What you can do after deploy
sidebar_label: First deployment
sidebar_position: 3
---

{/* migrated from range42/GETTING_STARTED.md "What you can do after deploy" */}

## Using range42-context

`range42-context` is the daily-use tool. It manages workspaces, switches between
infrastructures and scenarios, deploys/cleans up VMs, and reloads SSH keys.

It's a **shell function** (zsh), sourced from `~/.zshrc`. So `range42-context use`
modifies the current shell — no need to restart, no need to spawn subshells.

### List configured contexts

> Lists all configured contexts (workspaces) on this deployer-cli, with the active one marked.

A workspace is a `codename + scenario` combination. After step 7 above, you have one.
After multiple `range42-context init` runs, you have several.

```
$ range42-context list

  ── available workspaces ──────────────────────────────────────
  ● [1]  mylab-blank_scenario_2_subnets       range42-context use mylab blank_scenario_2_subnets
  ○ [2]  mylab-demo_lab                       range42-context use mylab demo_lab
  ○ [3]  otherlab-blank_scenario_4_subnets    range42-context use otherlab blank_scenario_4_subnets
```

The active workspace is marked `●`. Inactive workspaces are `○`. The right
column shows the exact command to switch to that workspace.

### Use a configured context

> Switches your shell to a configured context. SSH config, vault password,
> environment variables and prompt are all updated.

```
$ range42-context use mylab demo_lab

  ── switching context ────────────────────────────────────────
   ✓  workspace        : mylab-demo_lab
   ✓  vault password   : ~/range42.config/mylab-demo_lab/secrets/vault_pass.txt
   ✓  ssh keys loaded  : 4 keys
   ✓  ssh include      : ~/.ssh/config_range42-mylab-demo_lab
   ✓  prompt updated   : [mylab/demo_lab]
```

After this, all `range42-context` commands operate on the new workspace.

### Show the current context

> Shows which context is currently active in your shell.

```
$ range42-context current
mylab-demo_lab
```

### Inventory

Lists all hosts the active workspace will deploy:

```
$ range42-context show-inventory

@all:
  |--@range42_infrastructure:
  |  |--@r42_admin:
  |  |  |--r42.admin-wazuh
  |  |  |--r42.admin-deployer-api-gateway
  |  |  |--r42.admin-deployer-api-backend
  |  |  |--r42.admin-deployer-ui
  |  |--@r42_admin_wazuh_clients:
  |  |  |--r42.admin-deployer-api-gateway
  |  |  |--r42.admin-deployer-api-backend
  |  |  |--r42.admin-deployer-ui
  |  |--@r42_vuln_box_group:
  |  |  |--r42.vuln-box-00
  |  |  |--r42.vuln-box-01
  |  |  |--r42.vuln-box-02
  |  |  |--r42.vuln-box-03
  |  |  |--r42.vuln-box-04
  |  |--@proxmox:
  |  |  |--mylab
  |  |--@proxmox_cli:
  |  |  |--mylab-cli
```

Useful for sanity-checking what would be deployed before running `deploy`.

### Try a single catalog element

For fast iteration on a single deployable element (Docker compose / Makefile)
from [range42-catalog](https://github.com/range42/range42-catalog) without
rebuilding a full lab, range42 ships a disposable-VM mode:

```bash
range42-context catalog-try-list                # browse available elements
range42-context catalog-try docker/_ctf/hello   # deploy + smoke-check one
```

`catalog-try` resolves the logical path, deploys the element on the
`catalog_try` VM, runs it, and smoke-checks it per the element's contract
(`catalog_try.yml` declaring L2 service / oneshot / L1 fallback). Each run
destroys + recreates the test VM, so iteration is fast and stateless. Admin
elements (Gitea, Mattermost, Nextcloud ...) are listed separately via
`catalog-try-list-admin`.

You can also bootstrap a fresh deployer-cli directly into this mode from your
laptop:

```bash
./range42-init.py --catalog-try docker/_ctf/hello
```

The wizard skips the scenario picker, forces `scenario=catalog_try`, and the
final banner suggests the right `range42-context catalog-try <path>` to run.

### SSH into deployed VMs

`range42-context use` configures **two** things at once:
- Ansible inventory (for `range42-context deploy`)
- SSH config (for `ssh <hostname>` directly)

So once a workspace is active, you can SSH into any deployed VM by name:

```
$ ssh r42.bs2-team-143-01
alice@bs2-team-143-01:~$

$ ssh r42.admin-wazuh
alice@admin-wazuh:~$
```

The hostnames are defined in the auto-generated SSH config:
`~/.ssh/config_range42-<codename>-<scenario>` (included from `~/.ssh/config`).

VMs are on isolated bridges (vmbr143, vmbr144, etc.) — your operator machine
has no direct route to them. SSH uses **ProxyJump** through the Proxmox host:

```
   ┌─────────────────┐         ┌──────────────────────┐         ┌───────────────────────┐
   │  your machine   │  ssh    │  Proxmox             │  ssh    │  bs2-team-143-01      │
   │  (operator)     │ ──────▶ │  user: jump_user     │ ──────▶ │  user: alice          │
   │                 │         │  on internet bridge  │         │  on internal vmbr143  │
   │  ssh key:       │         │                      │         │                       │
   │  jump_user key  │         │  (ProxyJump only,    │         │  ssh key:             │
   │  + alice key    │         │  no shell session)   │         │  alice key            │
   └─────────────────┘         └──────────────────────┘         └───────────────────────┘
```

Both keys are loaded into your ssh-agent by `range42-context use`. If they
disappear (after reboot), reload them:

```bash
range42-context ssh-reload
```

### Initialise a new context

Use the wizard to add a new scenario or a new Proxmox infrastructure:

```bash
range42-context init
```

This launches `range42-init.py` again. From there you can:

- **Add a scenario to an existing codename** → pick the codename in step 2,
  then change the scenario in step 6 (e.g., switch from `blank_scenario_2_subnets`
  to `demo_lab`)
- **Add a new infrastructure (codename)** → pick "new" in step 2,
  enter a different codename in step 3

After init completes, the new workspace appears in `range42-context list`.

```
$ range42-context list

  ── available workspaces ──────────────────────────────────────
  ● [1]  mylab-blank_scenario_2_subnets       range42-context use mylab blank_scenario_2_subnets
  ○ [2]  mylab-demo_lab                       range42-context use mylab demo_lab    ← new
```

### Overwrite an existing configuration

If you want to redo a configuration from scratch (wrong Proxmox address,
changed credentials, etc.) — re-run the wizard and pick the existing config
in step 2 instead of "new".

```bash
range42-context init
```

In step 2, you'll see all your configured contexts listed below `◆ new`.
Pick the one you want to overwrite — the wizard will pre-fill all the fields
from the existing config, so you only need to update what changed.

:::warning

Overwriting a configuration **does not destroy deployed VMs**. It only
regenerates the local files (inventory, vault, SSH keys). If you also want
to clean up the running VMs, run `range42-context delete` afterwards (or
before, if the existing keys won't work anymore).

:::

You can also use this flow to:
- Update the Proxmox API address after migrating the host
- Re-generate SSH keys / vault if they got corrupted
- Tweak which bridges have NAT enabled
- Change the deployer-cli IP / user

### Deploy / undeploy

```bash
range42-context deploy        # full deploy (templates + VMs + software)
range42-context deploy-vms    # fast redeploy (skip templates)
range42-context delete        # destroy everything + clean SSH known_hosts
range42-context delete-vms    # destroy VMs only (keep templates)
```

### Reload SSH keys

If your ssh-agent loses keys (after reboot, etc.):

```bash
range42-context ssh-reload
```

### Full command list

```
$ range42-context

  ── range42-context ──────────────────────────────────────────
   use <codename> <scenario>      switch active workspace
   list                           list available workspaces
   current                        show active workspace
   status                         show context details
   inventory                      show ansible inventory
   ssh-reload                     reload SSH keys into ssh-agent
   deploy                         deploy scenario VMs
   deploy-vms                     deploy VMs only (skip templates)
   delete                         destroy all VMs and templates
   delete-vms                     destroy VMs only (keep templates)
   init                           launch wizard to add scenario/infra
   debug                          toggle verbose ansible output
```

## Where credentials live

range42 generates a lot of secrets at deploy time: SSH keys (4 of them), VM
passwords, the Wazuh password, the Proxmox API token. They all live under
your workspace, encrypted in an Ansible vault.

### Workspace layout

```
~/range42.config/<codename>-<scenario>/
├── secrets/
│   ├── default_vault.yml          ← encrypted vault (passwords, API token, etc.)
│   ├── vault_pass.txt             ← password to decrypt the vault (chmod 600)
│   ├── vault.view.sh              ← helper: view vault contents
│   ├── vault.edit.sh              ← helper: edit vault
│   ├── vault.create.sh            ← helper: create new vault
│   └── vault.changepwd.sh         ← helper: change vault password
├── ssh_keys/
│   ├── jump_keys/
│   │   ├── px.<codename>-<scenario>-ssh_cli.root         ← Proxmox root SSH key
│   │   └── px.<codename>-<scenario>-ssh_cli.jump_user    ← Proxmox jump user key
│   ├── backend_keys/
│   │   └── r42.<codename>-<scenario>-deployer-key_alice  ← admin user on VMs
│   └── student_keys/
│       └── r42.<codename>-<scenario>-student-key_bob     ← student user on VMs
├── inventory/
│   └── inventory_default.yml      ← ansible inventory (hosts + groups)
├── sourced_range42.sh             ← env vars sourced by range42-context use
└── scenario → ../../range42/range42-playbooks/scenarios/<scenario>/   ← symlink
```

### Where is the vault password

It's in the workspace, in plain text:

```
~/range42.config/<codename>-<scenario>/secrets/vault_pass.txt
```

This file has `chmod 600` and is owned by your user. It exists by design —
this is what allows `range42-context deploy` to run without prompting for the
vault password every time.

:::warning

This means **anyone with read access to your home directory can decrypt
the vault**. Don't share `~/range42.config/` or back it up to insecure storage.

:::

### How to view the vault contents

The vault contains generated VM passwords, the Wazuh password, the Proxmox API
token, and the SSH key passphrases (`ssh_passphrase_px_root`,
`ssh_passphrase_px_jump`, `ssh_passphrase_admin_alice`,
`ssh_passphrase_student_bob`, plus one per student extra key). To inspect them
with the active workspace loaded:

```bash
range42-context show-vault
```

This wraps `ansible-vault view` against the active workspace's
`default_vault.yml` and uses `vault_pass.txt` automatically.

If you prefer working from the workspace directory directly, the helper
scripts shipped in the workspace still work:

```bash
cd ~/range42.config/<codename>-<scenario>/secrets/
./vault.view.sh default_vault.yml
```

To edit:

```bash
./vault.edit.sh default_vault.yml
```

Opens the vault in `$EDITOR`, encrypts on save.

### I lost my Proxmox root password

If you generated passwords during the wizard, the actual password is **inside
the vault**. View it:

```bash
./vault.view.sh default_vault.yml | grep -i password
```

If the wizard didn't generate it (you provided your own), it's not stored
anywhere by range42 — only the SSH root key was installed on Proxmox.

### I lost my SSH keys for the VMs

The keys live in `~/range42.config/<codename>-<scenario>/ssh_keys/`. As long as
you have this directory, you have everything.

If `range42-context use` complains about missing keys, run:

```bash
range42-context ssh-reload
```

If the keys themselves are physically deleted, the simplest recovery is to
redeploy:

```bash
range42-context delete
range42-context deploy   # regenerates SSH keys + vault, recreates Proxmox config
```

This is destructive — your VMs will be recreated from scratch.

### I want to back up everything

Use `range42-workspace export`:

```bash
range42-workspace export <codename> <scenario>
# → <codename>-<scenario>.r42.tar.gz  (includes secrets, ssh_keys, inventory)
```

Store this tarball somewhere safe (encrypted disk, password manager attachment,
etc.). To restore on another machine:

```bash
range42-workspace import <codename>-<scenario>.r42.tar.gz
range42-context use <codename> <scenario>
```
