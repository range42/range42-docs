---
id: deploying-and-monitoring
title: Deploying and monitoring
sidebar_position: 5
---

Once a topology is designed, you deploy it from the project editor and then watch the
deployment run to completion. This page covers the deploy form, the preflight checks
that run before submission, the deployments list and detail views, and the actions you
can take on a running or finished deployment.

## Before you deploy

Two things must be in place:

- A topology that passes validation. See [Designing a topology](./designing-a-topology.md)
  for how the editor surfaces validation problems, and [Node reference](./node-reference.md)
  for the individual components.
- At least one backend API host configured. The deploy form reads its list of target
  Proxmox hosts from the backend, which you configure under
  [Settings and sources](./settings-and-sources.md). If no host is configured, the host
  selector in the deploy form is empty and you cannot submit.

## The deploy form

The Deploy action in the project editor opens a single modal that collects the
deployment parameters, runs preflight inline, and submits. All fields marked with an
asterisk are required.

- **Codename** — a short identifier for this deployment, for example `lab-spring-2025`.
  It must be lowercase letters, digits and hyphens, between 3 and 32 characters, and may
  not start or end with a hyphen. The form rejects a codename that collides with one you
  have already used locally.
- **Scenario label** — a free-text label describing what this deployment is.
- **Target host** — the Proxmox host to deploy to, chosen from the hosts configured in
  Settings. Each option shows the host name and, where available, its node name.
- **Team count** — only shown when the project contains team-scope groups (a gamenet).
  It sets how many team copies are deployed and must be at least 1. Team-scope groups are
  described in [Node reference](./node-reference.md). For a single-environment lab without
  team-scope groups, this field does not appear.
- **Vault password** — the Ansible Vault password used by the backend for this
  deployment. It is entered as a password field and is not stored by the form.

Below the fields, the form shows a read-only **SHA pin** panel listing the exact catalog
and project commit SHAs that will be deployed. You must tick the acknowledgement checkbox
to confirm you intend to deploy those exact revisions before the Deploy button enables.

When you submit, the form sends the deployment request to the backend
(`POST /v1/deployments`) and takes you to the deployment detail page for the new
deployment.

## Preflight

Preflight is a set of validation checks the backend runs against your parameters before
the deployment is created. It runs when you click **Run preflight**, and also
automatically when you leave a field once the required fields are filled in.

Each check returns one of three results:

- **pass** — the check is satisfied.
- **warn** — a non-blocking concern. Warnings do not stop a deploy, but if any are
  present you must tick an acknowledgement checkbox before the Deploy button enables.
- **block** — a blocking problem. While any check blocks, the Deploy button stays
  disabled and you cannot submit until the underlying issue is resolved and preflight
  is re-run clean.

After a deployment exists, its preflight report is available as a standalone, shareable
page at `/deployments/:id/preflight`, reachable from the **Preflight** link on the
deployment detail page. The report lists every check with its pass/warn/block result and
detail, shows the codename and scenario label so it is self-describing, and has a
**Copy link** button that puts the page URL on the clipboard so you can share it.

## Watching a deployment

### The deployments list

`/deployments` lists every deployment in two sections:

- **Active** — deployments that are still in a non-terminal state (for example
  preflight or deploying).
- **Past** — completed deployments (deployed, failed, cancelled or torn down), grouped
  by project.

Each row shows the codename, scenario label, a state badge, the start time and the
number of attempts, and opens the deployment detail page when clicked. Two filter toggles
at the top narrow the list to **in-progress only** or **failed only**; a clear control
resets the filter.

### The deployment detail view

`/deployments/:id` shows one deployment and updates live as it runs — progress, state and
logs stream into the page without a manual refresh. A header shows the codename, scenario
label, the current state and a live progress bar, plus a link to the preflight report.
Two header actions are always available: **Cancel** (request the backend to stop the run)
and **Teardown** (destroy the deployment, described below).

The detail view has three tabs:

- **Overview** — the chain of deployment attempts and the current phase and last
  heartbeat.
- **Teams** — a grid of per-team cards (relevant for gamenet deployments). Each card
  shows the team identifier, a status badge, its most recent log lines and a snapshot
  count, and carries the per-team actions described below.
- **Logs** — the combined live log stream, with a text filter. You can narrow logs to a
  single team (for example by opening logs from a team card) and download the raw event
  stream.

The default tab is **Teams** when the deployment has more than one team and is actively
deploying or deployed; otherwise the **Overview** tab opens first. The selected tab is
reflected in the URL.

## Managing a deployment

### Per-team actions

Each team card on the Teams tab has a menu with the following actions:

- **Reset** — re-run the deployment for that team. If the deployment is currently
  in-flight, the reset is queued instead of run immediately: the card shows a "queued"
  badge, and you are prompted to run it once the in-flight attempt finishes.
- **Snapshot** — create a snapshot of the team's environment, so you can roll back to it
  later.
- **Rollback** — restore the team to a previously taken snapshot. You pick a snapshot
  from the list for that team. If some of the underlying VM snapshots are missing (for
  example because snapshot retention expired), the modal lists what is missing and offers
  a partial rollback.

The card menu also offers convenience actions to copy the team's SSH command and to open
a terminal for the team, where the backend provides them.

### Teardown

The **Teardown** action in the detail header destroys the whole deployment. Because it is
destructive, it requires you to type the deployment's codename exactly to confirm before
the destroy button enables. Once confirmed, the teardown is requested from the backend and
you are returned to the deployments list; teardown progress continues to stream on the
detail view.
