---
id: overview
title: Overview
sidebar_position: 1
---

The Range42 Deployer UI is a web application for designing and deploying cyber-range
infrastructure on a node-based canvas. You drag infrastructure components (virtual
machines, containers, networks, routers, firewalls) onto a canvas, connect and
configure them to describe a topology, and then trigger a deployment. The canvas is
built on [VueFlow](https://vueflow.dev/); each node represents one infrastructure
component, and each project is a separate canvas workspace.

## Where it fits

The UI only designs the topology and triggers deployments. It does not provision
anything itself. The actual work is carried out by the backend, which runs Ansible
against Proxmox:

```text
Deployer UI (VueFlow canvas)
        |  designs the topology, sends a deployment request
        v
Backend API (FastAPI)
        |  runs playbooks
        v
Ansible
        |  drives the Proxmox API
        v
Proxmox  ->  VMs / LXC containers / networks
```

Because the UI is a front end to this pipeline, you configure the backend API URL in
the settings before a deployment can run. See [Settings and sources](./settings-and-sources.md).

## The canvas model

Each project is a canvas of nodes connected by edges:

- **Nodes** are infrastructure components. The palette groups them as Compute
  (Virtual Machine, Container, Docker), Network (Network, Router, Firewall), and
  Organization (Group). Drag one onto the canvas to add it.
- **Edges** are the connections you draw between nodes to express how the topology
  is wired.
- **Configuration** happens in a side panel: select a node and fill in the parameters
  it needs before it can be deployed.

For the full list of node types and their settings, see [Node reference](./node-reference.md).
For how to assemble nodes into a working topology, see [Designing a topology](./designing-a-topology.md).

## Status badges

Every node shows a colored status badge so you can see its state at a glance:

| Badge | Meaning |
|-------|---------|
| Gray | Incomplete or unconfigured |
| Orange | Ready to deploy |
| Green | Running / deployed |
| Red | Error |
| Blue (pulsing) | Deploying |

## The main screens

| Screen | Purpose | More |
|--------|---------|------|
| Home (`/`) | The list of your projects: create, import, duplicate, open, and delete | — |
| Catalog (`/catalog`) | Browse reusable lab, gamenet, and other entries from configured sources, and open an entry for detail | [Catalog](./catalog.md) |
| Project Editor (`/project/:id`) | The main workspace: canvas, configuration panel, and editor tabs | [Designing a topology](./designing-a-topology.md) |
| Deployments (`/deployments`) | Track active and past deployments, drill into a deployment, and view its preflight report | [Deploying and monitoring](./deploying-and-monitoring.md) |
| Sources (`/sources`) | Manage the git sources that supply catalog entries and store projects | [Settings and sources](./settings-and-sources.md) |
| Settings (`/settings`) | User identity, backend and Proxmox configuration, and related defaults | [Settings and sources](./settings-and-sources.md) |

## Where your data lives

Your projects live in your browser's local storage. Each project is a canvas
workspace serialized to JSON and kept in the browser, so it is available immediately
and works offline. To share or back up a project, connect a git source: projects can
sync to a configured git repository. See [Settings and sources](./settings-and-sources.md)
for configuring sources and authentication.
