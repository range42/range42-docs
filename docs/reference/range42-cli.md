---
id: range42-cli
title: range42 CLI
sidebar_position: 1
---

{/* migrated from range42/README.md "Quick start" + "Daily operations" */}

## Quick start

The recommended way to deploy range42 is the setup wizard:

```bash
sudo apt-get update ; apt-get upgrade -y
sudo apt-get install python3-venv git
mkdir -p $HOME/range42 && cd $HOME/range42
git clone https://github.com/range42/range42.git
cd range42
./range42-init.py
```

The wizard walks you through preflight checks, Proxmox connection, network configuration and the full deployment.

For the complete walkthrough (prerequisites, every wizard step explained, SSH access, daily operations, troubleshooting), see the [Getting Started](/docs/getting-started/prerequisites) guide.

If you'd rather drive the playbooks yourself, see the [Manual setup](/docs/operations/manual-setup) page.

## Supported platforms

range42 is developed and tested on Ubuntu LTS (Desktop / Server) and is also expected to work on Debian 13. Full details and prerequisites: [Prerequisites](/docs/getting-started/prerequisites).

## Daily operations

Once deployed, you manage your lab with the `range42-context` shell tool (switch workspaces, deploy / undeploy, SSH into VMs, view credentials, etc.).

### Switch workspace and deploy

```bash
range42-context use <codename> <scenario>
range42-context deploy          # full deploy (templates + VMs + software)
range42-context deploy-vms      # VMs only (skip templates — fast redeploy)
```

### Tear down

```bash
range42-context delete          # destroy everything
range42-context delete-vms      # destroy VMs only (keep templates)
```

### Direct scenario scripts

Each scenario ships convenience shell scripts as an alternative to the CLI:

```bash
cd ~/range42/range42-playbooks/scenarios/demo_lab/
./demo_lab.setup.sh             # full deploy
./demo_lab.setup_vms_only.sh    # fast redeploy (skip templates)
./demo_lab.delete_all.sh        # destroy everything + clean SSH known_hosts
./demo_lab.delete_vms_only.sh   # destroy VMs only
./demo_lab.reset.setup.sh       # delete all + redeploy from scratch
./demo_lab.reset.ssh_keys.sh    # reset SSH keys only
```

### Work on a single VM

Each VM in each stage has its own `*.devkit/` directory with helper scripts for fast iteration:

```bash
cd scenarios/demo_lab/02_admin_infrastructure/stage_01/mon_wazuh.devkit/

./demo_lab.mon_wazuh.install.sh     # (re)install software on this VM only
./demo_lab.mon_wazuh.snapshot.sh    # snapshot before a risky change
./demo_lab.mon_wazuh.revert.sh      # something broke? revert to last snapshot
```

Every VM has `install.sh`. VMs that support it also have `snapshot.sh` and `revert.sh`.

## Extend the scenarios

All deployable scenarios live in [range42-playbooks/scenarios](https://github.com/range42/range42-playbooks/tree/main/scenarios) — the list will grow over time.

The reusable building blocks (CVEs, misconfigured services, product setups, Ansible roles) live in the [range42-catalog](https://github.com/range42/range42-catalog) repository.

**Want a specific product, CVE or misconfiguration added?** Open an issue on the [range42-catalog](https://github.com/range42/range42-catalog/issues) repo — catalog requests are centralised there.

**Found a bug or have a feature request?** Open an issue on the [range42](https://github.com/range42/range42/issues) repo (anything not related to the catalog goes here).
