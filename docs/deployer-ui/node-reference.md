---
id: node-reference
title: Node reference
sidebar_position: 2
---

This page documents the node types you can place on a project canvas. The palette in
the left sidebar groups them under three categories: **Compute**, **Network**, and
**Organization**. Drag a node from the palette onto the canvas. Once a node is on the
canvas, select it to open its configuration panel, where you fill in the settings
described below.

For how to wire nodes together into a working topology, see
[Designing a topology](./designing-a-topology.md). For browsing reusable entries you can
drop onto the canvas, see [Catalog](./catalog.md).

## Status badges

Every node shows a colored status badge so you can tell its state at a glance. The same
legend applies to all node types:

| Badge | Meaning |
|-------|---------|
| Gray | Incomplete or unconfigured |
| Orange | Ready to deploy |
| Green | Running / deployed |
| Red | Error |
| Blue (pulsing) | Deploying |

## Shared settings

A few settings appear on more than one node type:

- **Name** — every node has a name field. It is required; a node with no name stays
  gray (incomplete) instead of turning orange (ready).
- **Role** — the three compute nodes (Virtual Machine, Container, Docker) have a role
  selector with the choices `auto`, `admin`, `team`, `trainee`, and `shared`. Leave it
  on `auto` to let the platform decide.
- **Tags** — Virtual Machine and Container nodes have a tag editor with a set of
  predefined tags plus free-form entry. Tags are shown as colored chips on the node.
- **Attachments** — every node has an attachments section for associating files with
  it.

## Compute

Compute nodes are the hosts and workloads in your range. They connect to Network
nodes to express which segment they live on.

### Virtual Machine

Type `vm`.

A full virtual machine provisioned on Proxmox. Settings:

- **Name** (required) and **Tags**.
- **Role** (see shared settings).
- **Clone from template** — select a Proxmox template to clone. The list is fetched
  from your configured Proxmox node, and you can refresh it. Choosing a template
  auto-fills CPU and RAM, which you can then edit.
- **CPU Cores**, **Memory (MB)**, and **Disk** (for example `32G`).
- **Disk Storage** — which Proxmox storage holds the VM disk. This appears only when
  storages are available, and overrides the project default.
- **IP Address** (optional) — leave empty for DHCP or a cloud-init default.
- **Description**.

When a VM is deployed, the panel changes to a live view with its current status, CPU
and RAM metrics, power controls (start, stop, pause, resume), and editable fields with
revert affordances. Its VMID is shown once it exists on Proxmox.

### Container

Type `lxc`.

An LXC container on Proxmox, lighter weight than a full VM. Settings:

- **Name** (required) and **Tags**.
- **Role** (see shared settings).
- **Description**.
- **Hostname**.
- **IP Address** — a static IP for the container.

### Docker

Type `docker`.

A Docker container. Settings:

- **Name** (required) and **Role** (see shared settings).
- **Docker Image** (required) — image name with an optional tag, for example
  `nginx:latest`.
- **Port Mapping** (required) — `host:container` pairs, comma-separated, for example
  `80:80, 443:443`.
- **Environment Variables** — `KEY=value`, one per line.
- **Container Network** — `bridge` (default), `host`, `none`, or `custom`.

## Network

Network nodes describe the segments your hosts attach to and the appliances that route
or filter traffic between them. Compute nodes connect to a Network segment; routers and
firewalls sit between segments.

### Network

Type `network-segment`.

A network segment that hosts attach to. Settings:

- **Name** (required).
- **Network Zone Type** (required) — the security-zone purpose of the segment: `WAN`
  (external/internet facing), `DMZ` (demilitarized zone), `LAN` (internal network),
  `Management` (admin/out-of-band access), or `Custom`.
- **Description**.
- **Proxmox Bridge** (required) — the bridge name on the Proxmox node, for example
  `vmbr0`. The bridge must exist on the node.
- **VLAN Tag** (optional) — an 802.1Q VLAN ID between 1 and 4094.
- **CIDR** — the network range in CIDR notation (used for planning).
- **Gateway** — the default gateway IP for the segment.

### Router

Type `router`.

A virtual router appliance that connects network segments. Settings:

- **Name** (required).
- **Description**.
- **Appliance Type** — `VyOS`, `OPNsense`, or `pfSense`.

A router exposes connection points on all four sides so you can wire it between
multiple segments.

### Firewall

Type `edge-firewall`.

An edge firewall that connects your network segments. Settings:

- **Name** (required).
- **Description**.
- **Appliance Type** — `pfSense` or `OPNsense`.

## Organization

### Group

Type `group`.

A group is a container you drop other nodes into. It does not provision anything on its
own; it organizes the nodes inside it. The group has two modes, set by the **Kind**
setting:

- **Topology group (static)** — a plain organizing group. Use it to keep related parts
  of a topology together visually. This is the default.
- **Team scope (replicated per team)** — at deploy time, the contents of the group are
  replicated once per team. When you select this kind, a **Team count** field appears
  (1 to 64) for the number of teams. On the canvas, a team-scope group is styled
  differently, shows a `×N at deploy` chip, and offers an **Expand** toggle that draws
  faint outlines previewing the replicated copies. You can switch a group between the
  two kinds directly from its header.

Other group settings:

- **Name** and **Description**.
- **Prefix** — applied to all items in the group.
- **Resource Pool** — the Proxmox resource pool name.
- **Tags** — a comma-separated list.
