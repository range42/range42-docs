---
id: designing-a-topology
title: Designing a topology
sidebar_position: 3
---

A topology is the visual graph you build for a project: the virtual machines,
containers, networks, routers and firewalls that make up a range, plus the
connections between them. You design it on a canvas, configure each element in
a side panel, check it for problems, and save it. Deploying the result is a
separate step covered in [Deploying and monitoring](./deploying-and-monitoring.md).

For an overview of the application and how the pieces fit together, see
[Overview](./overview.md). For a reference of every node type and its settings,
see [Node reference](./node-reference.md).

## Create or open a project

Projects live on the Home dashboard. From there you can:

- **New Project** — click *New Project* (or the dashed *New Project* card),
  give the project a name and an optional description, then *Create Project*.
  You are taken straight into the editor with an empty canvas.
- **Import** — click *Import* and choose a previously exported project file
  (`.json`). The imported project opens in the editor.
- **Duplicate** — open a project card's action menu (the three-dot button) and
  choose *Duplicate* to make a copy with all its nodes and connections.
- **Open** — click any project card to open it in the editor.
- **Delete** — use *Delete* in a project card's action menu, or *Delete
  Project* from the editor's settings menu (deleting from the editor asks you
  to type the project name to confirm).

You can also start a project from an existing catalog entry instead of a blank
canvas. That flow is described in [Catalog](./catalog.md).

## The editor layout

The project editor is organised as a set of tabs across the top:

- **canvas** — the visual graph editor (the main workspace).
- **config** — a per-file editor for the project's configuration files.
- **variables** — deployment variables and overrides.
- **history** — commit history, shown when the project is linked to a git
  source.
- **settings** — per-project settings.

On the **canvas** tab you get three areas: a left sidebar (the palette and
actions), the canvas itself in the centre, and a docked **Problems** panel and
activity feed below it. A configuration panel slides in from the right when you
select a node.

## Add nodes

The palette is the left sidebar, grouped into three categories:

- **Compute** — Virtual Machine, Container (LXC), Docker
- **Network** — Network, Router, Firewall
- **Organization** — Group

To add a node, **drag it from the palette onto the canvas**. Drop it on empty
space to place it free-standing, or drop it inside a Network or Group node to
nest it within that container. The new node starts with default settings and an
incomplete (gray) status until you configure it.

A few placement behaviours are automatic:

- Dropping a node inside a Network segment or Group makes it a child of that
  container.
- Dropping a Docker node attaches it to the nearest VM or LXC as its host. If
  no VM or LXC exists yet, the Docker node is added without a host and the
  Problems panel flags it until you assign one.

To remove a node, select it and use the delete action in its configuration
panel.

See [Node reference](./node-reference.md) for what each node type represents and
which settings it exposes.

## Connect nodes

Drag from a node's connection handle to another node to create an edge.

The meaningful connection is **compute to a Network segment**: connecting a VM,
LXC, router or firewall to a Network creates a network link. That link carries
interface settings — interface name, model, IP address (static in CIDR
notation, or left empty for DHCP), MAC address, VLAN tag, MTU and an optional
gateway flag. New network links default to DHCP with the Proxmox firewall
enabled on the interface.

To edit a connection, click the edge. A small connection panel opens where you
can adjust its interface settings.

## Configure a node

Click a node to open its configuration panel on the right (you can also select
a node and press **Enter**). The panel header shows the node type and a status
badge that reflects the node's state.

Every node has a **Name** field; a name is required before the node is
considered complete. Depending on the node type you can also set tags, a role,
and type-specific settings (for example CPU cores, memory and a template for a
VM, or a bridge and CIDR for a Network).

The status badge follows the same colour system used across the canvas:

- **gray** — incomplete (required fields are still missing)
- **orange** — ready
- **green** — running
- **red** — error
- **blue** — deploying

As you fill in the required fields, the badge moves from gray (incomplete) to
orange (ready). The running, deploying and error states appear once a node is
deployed and reporting live status.

To close the panel, use its close button or select empty canvas.

## Canvas housekeeping

Two controls in the top bar help keep a topology tidy:

- **Organize** — automatically lays out the nodes based on the topology.
- **Save** — writes the current state of the project (see below).

On the canvas you can also use **Ctrl+Z** / **Ctrl+Shift+Z** to undo and redo
canvas changes, and the arrow keys to move the selection between nodes.

## The config tab

The **config** tab is a file editor for the project's configuration files, not
a live mirror of the canvas. It has three columns:

- a file tree on the left,
- a two-pane editor in the centre, showing a read-only **Base** copy of the
  selected file next to an editable **Overlay** copy, and
- an attachment manager on the right.

Editing happens in the Overlay pane. The editor highlights YAML, Markdown,
shell and Dockerfile content based on the file extension. Changes are saved
when you leave the editor or press **Ctrl+S** inside it. If the overlay file
has drifted from its base version, a banner flags the difference.

## Validate the design

There are two complementary ways to check a topology.

The **Problems** panel is docked below the canvas and updates continuously as
you edit. It lists errors and warnings — for example a Docker node with no
host, a team group missing a team count, or a network link with an
inconsistent setting. Each row shows the message and a short code. Click a row
(or focus it and press **Enter**) to jump to the offending node or edge.

The **Validate** action (in the sidebar's quick actions, and in the editor's
settings menu) runs a topology check on demand and reports the result as a
notification: either a confirmation that the topology is valid, or a summary of
the errors it found.

Fix the issues the panel points to before deploying.

## Find things quickly

Press **Ctrl+P** (or **Cmd+P**) to open the command palette. It lists the
project's nodes, attachments and files; choose an entry to jump to it on the
canvas.

## Save and persist

Projects are saved automatically. Shortly after each change, the editor writes
the canvas to local storage in your browser, so reopening the project restores
your work. The node and connection counts shown on the project card and in the
sidebar reflect the saved state.

Use the **Save** button in the top bar to save immediately. When a project is
linked to a git source, saving also serialises the topology and pushes it to
the repository so it can be deployed; the resulting commit is recorded for the
deployment step. Projects that are not linked to a git source are kept in local
storage only.

To link a project to a git source and manage those sources, see
[Settings and sources](./settings-and-sources.md). Once your topology is valid and
saved, continue to [Deploying and monitoring](./deploying-and-monitoring.md).
