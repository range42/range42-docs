---
id: intro
title: Introduction
slug: /
sidebar_position: 1
---

{/* migrated from range42/GETTING_STARTED.md "What you'll deploy" */}

:::caution Draft v0.1 — work in progress

Screenshots and steps may be incomplete. Open an issue or PR on the [range42 repo](https://github.com/range42/range42) for any inaccuracy.

:::

## What you'll deploy

This guide walks through deploying `blank_scenario_2_subnets` — a minimal network lab with 4 Linux VMs across 2 subnets.

### What is a "blank scenario"?

It's not really a "scenario" in the classical sense (e.g., a CTF, a SIEM lab).
It's a **clean working base**: a few empty Ubuntu VMs across isolated subnets,
ready for you to install whatever you want on top — services, workloads,
training material, attack/defense exercises.

Think of it as a **starter kit** — a working network of VMs ready in ~20 minutes,
then yours to populate with whatever services, workloads, or training material
you want on top.

range42 ships 3 blank scenarios:
- `blank_scenario_2_subnets` — 2 subnets, 4 VMs (this guide)
- `blank_scenario_4_subnets` — 4 subnets, 16 VMs
- `blank_scenario_6_subnets` — 6 subnets, 24 VMs

For a full SIEM + CTF cyber range, see `demo_lab` instead (still a work in progress).

All scenarios live in [range42-playbooks/scenarios](https://github.com/range42/range42-playbooks/tree/main/scenarios) — the list will grow over time. Open an issue on [range42-catalog](https://github.com/range42/range42-catalog/issues) to request new ones.

### Prerequisites for this guide

- A Proxmox VE 7.x or 8.x server you can reach
- Linux operator machine with Python 3.10+
- ~25 minutes of your time (mostly automated)

When done, you'll have:

```
   ┌─────────────────────┐                     ┌──────────────────────────────────┐
   │   deployer-cli      │                     │           Proxmox VE             │
   │   (your machine)    │  ──── SSH/API ────▶ │          (ip_forward=1)          │
   │   range42-context   │                     │                                  │
   └─────────────────────┘                     │  ┌────────┐                      │
                                               │  │ vmbr0  │  → internet (NAT)    │
                                               │  └────────┘                      │
                                               │                                  │
                                               │  ┌─────────────────────────────┐ │
                                               │  │ vmbr143  192.168.143.0/24   │ │
                                               │  │   ├─ bs2-team-143-01  .200  │ │
                                               │  │   └─ bs2-team-143-02  .201  │ │
                                               │  └─────────────────────────────┘ │
                                               │                                  │
                                               │  ┌─────────────────────────────┐ │
                                               │  │ vmbr144  192.168.144.0/24   │ │
                                               │  │   ├─ bs2-team-144-01  .200  │ │
                                               │  │   └─ bs2-team-144-02  .201  │ │
                                               │  └─────────────────────────────┘ │
                                               └──────────────────────────────────┘
```

You SSH into VMs via the Proxmox jump host:

```
deployer-cli  ──ssh──▶  Proxmox jump_user  ──ProxyJump──▶  bs2-team-XXX-XX
```
