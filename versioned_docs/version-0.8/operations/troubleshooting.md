---
id: troubleshooting
title: Troubleshooting
sidebar_position: 2
---

{/* migrated from range42/GETTING_STARTED.md "Troubleshooting" */}

## The fast way — use range42-context

Most issues with stale state (failed deploy, partial cleanup, IP/key conflicts)
can be fixed by tearing down and redeploying. After `range42-context use <codename> <scenario>`:

```bash
# full reset (deletes templates + VMs + SSH known_hosts, then redeploys)
range42-context delete
range42-context deploy

# faster reset (keeps templates, recreates VMs only)
range42-context delete-vms
range42-context deploy-vms
```

This handles 90% of issues automatically — start here before deep-diving.

## What's happening behind the scenes

If you want to understand what's actually breaking before running `delete`:

**Wizard fails on preflight**
Missing local dependencies. Install the apt packages shown by the wizard.
The wizard checks: `ansible`, `ssh-keygen`, `ssh-agent`, `sshpass`, `git`, `keychain`, `zsh`,
plus Ansible collections `community.crypto` and `community.general`.

**Proxmox check fails**
The wizard couldn't reach `https://<address>:8006`. Verify manually with
`curl -k https://<address>:8006`. Common causes: wrong IP, firewall, Proxmox not running.

**Deploy fails on `vm_create` "already exists"**
Templates (vm\_id 9211–9248) exist from a previous deploy. The proxmox controller
auto-skips them — just re-run. If the failure persists, run `range42-context delete`
to remove leftover state.

**SSH "REMOTE HOST IDENTIFICATION HAS CHANGED"**
The IP was previously used by a different VM with a different SSH host key.
The `delete` and `delete-vms` commands handle this by running:

```bash
~/range42/range42-playbooks/scenarios/blank_scenario_2_subnets/blank_scenario_2_subnets.reset.ssh_keys.sh
```

You can run this script directly if you only want to reset known\_hosts without redeploying.

**Deploy fails on `chattr` errors during SSH key generation**
Already fixed in current version. Pull latest from range42 repo. The fix removes
`attributes: ""` from `openssh_keypair` which was failing on virtio/qcow2 disks.

**Vault corrupted or unable to decrypt**
The simplest recovery is to redeploy the VMs (the vault itself is regenerated
during deploy, and the SSH keys it references are also regenerated):

```bash
range42-context delete-vms
range42-context deploy-vms
```

This keeps the Proxmox templates (no need to re-download cloud images) but
recreates everything else, including a fresh vault.

If the vault is intact but you can't view it, check `vault_pass.txt` exists in
the same `secrets/` directory and is readable.

**Wazuh / admin VMs**
This guide deploys `blank_scenario_2_subnets` which **supports** the admin
infrastructure (wazuh server + deployer platform on `vmbr142`). It's currently
**disabled by default** because not fully tested. To enable, edit
`scenarios/blank_scenario_2_subnets/main.yml` and uncomment the
`01_admin_infrastructure/_main.yml` import (and the related blocks in that file).
