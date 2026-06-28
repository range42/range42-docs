---
id: prerequisites
title: Prerequisites
sidebar_position: 1
---

{/* migrated from range42/GETTING_STARTED.md "Prerequisites" */}

## On your local machine (operator workstation)

- Linux:
  - **Ubuntu LTS Desktop or Server (24.04)** — primary supported platform, what we develop and test on
  - **Debian 13** — also expected to work (less extensively tested)
  - Other distros may work but are not officially supported
- Python 3.10+
- `python3-bcrypt` (required to generate passphrase-protected ed25519 SSH keys; the wizard preflight detects it and offers an Install button if missing, but you can pre-install with `sudo apt install python3-bcrypt`)
- Network access to your Proxmox (see ports below)

## On the Proxmox server

- One physical interface with internet access (e.g., `vmbr0`)
- Root SSH access enabled (the wizard will install a key automatically)
- Storage `local-lvm` available

## Network ports — operator → Proxmox

The wizard and `range42-context` need these open from your operator machine to the Proxmox host:

| Port | Protocol | Used for |
|------|----------|----------|
| 22 | TCP | SSH (root for bootstrap, jump\_user for ProxyJump after) |
| 8006 | HTTPS | Proxmox API (VM lifecycle, network config, etc.) |

If you're behind a firewall, allow at least 22 + 8006.

## Optional — local apt proxy

If you have a local apt cache (apt-cacher-ng, Squid, etc.), the wizard's
**step 0** lets you provide its URL. When set, range42 plumbs the proxy through
three layers automatically:

- **deployer-cli** (`/etc/apt/apt.conf.d/00range42-proxy`) — applied by
  `deployer.bootstrap` before any apt install
- **Proxmox host** — a cloud-init snippet is dropped at
  `/var/lib/vz/snippets/range42-apt-proxy.yaml` by `proxmox.init`
- **lab VMs** — the snippet is attached as cloud-init `vendor-data` on every
  VM template (`qm set <id> --cicustom vendor=...`); all clones inherit the
  proxy at first boot

Format expected: `http(s)://host:port` (e.g. `http://192.168.1.50:3142` for
apt-cacher-ng's default port). The wizard validates the format and runs a
reachability check before letting you proceed.

Leave the field empty in the wizard if you don't have a proxy — everything
works without it, just slower on apt-heavy installs.
