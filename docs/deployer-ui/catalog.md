---
id: catalog
title: Catalog
sidebar_position: 4
---

The Catalog is where you browse reusable infrastructure entries and turn one into a
project you can edit and deploy. It is the starting point when you want to build on an
existing lab, gamenet, or component instead of designing a topology from a blank canvas.

## Where entries come from

Catalog entries are pulled from the git sources you have registered. Each source is a
git repository (GitHub, GitLab, or Gitea) configured on the Sources page; the catalog
aggregates the entries from every configured source into a single list. If you have not
registered any sources yet, the catalog is empty and prompts you to add one. See
[Settings and sources](./settings-and-sources.md) for adding and authenticating sources.

The catalog list lives at `/catalog`, and each entry has its own detail page at
`/catalog/:source/:entry`.

## Browsing and filtering

The catalog list shows one tile per entry. Each tile displays the entry name, its
source and path, a kind badge, an optional description, and any tags.

Every entry has a **kind**. The kinds are:

| Kind | Badge |
|------|-------|
| `lab` | Primary |
| `gamenet` | Secondary |
| `component` | Accent |
| `container` | Info |
| `ansible_role` | Warning |

All filtering is performed in the browser over the full set of fetched entries, so
toggling any control updates the grid immediately. You can combine these filter
dimensions:

- **Kind** — a row of toggle buttons, one per kind. Selecting more than one shows
  entries matching any of the selected kinds.
- **Source** — a row of toggle buttons, one per registered source. Selecting more than
  one shows entries from any of the selected sources.
- **OS** — a text field. Matches the entry's OS value exactly (case-insensitive).
- **Difficulty** — a dropdown with `easy`, `medium`, and `hard`.
- **Tags** — a comma-separated text field. An entry must carry every tag you list.
- **Search** — free text matched against the entry name, description, and path.

The dimensions combine with AND (an entry must satisfy all active filters). A **Clear**
button resets every filter at once.

A source can be marked read-only. Tiles from a read-only source carry a small
read-only badge, which affects the Customize action described below.

## The entry detail page

Opening an entry shows a full-page view with:

- **Header** — the entry name, kind badge, its source and path, a short commit SHA
  pill, and the last-updated time when available.
- **README** — a plain-text preview of the entry's README.
- **Topology preview** — a read-only VueFlow canvas rendering the entry's nodes and
  edges. It is shown only when the entry carries topology data, and you cannot edit or
  rearrange it here; you can pan to inspect it.
- **Metadata** — a key/value table built from the entry's OS, difficulty, tags, and any
  additional metadata fields.
- **Attachments** — a list of the entry's inventory items, each shown with its kind and
  path. Shown only when the entry has attachments.

## Actions: Use, Customize, Fork & publish

Both the list tiles and the entry detail page expose three actions.

### Use

Creates a new project from the entry, named after the entry, and opens it on the
canvas. The project records a reference back to the catalog entry (its source, path,
and SHA) in `use` mode. Choose this when you want to take the entry as-is and work from
it.

### Customize

Creates a new project named `<entry> (custom)`, records a reference to the catalog
entry in `customize` mode, and opens it on the canvas. Choose this when you intend to
modify the entry and publish your changes back. This action is disabled for entries
whose source is read-only, because customizing publishes back to the source; for a
read-only entry, use Fork & publish to a repository you can write to instead.

After Use or Customize, you land in the project editor. See
[Designing a topology](./designing-a-topology.md) for editing the canvas, and
[Deploying and monitoring](./deploying-and-monitoring.md) for deploying it.

### Fork & publish

Opens a dialog asking for a target repository (in `owner/repo` form) and a name. On
submit, it creates a branch named `catalog/<name>` in that repository and writes a seed
`range42.yaml` file that points back at the original entry, using the credentials of
the originating source's provider. It then opens the detail page for the new entry in
your repository. Choose this when you want your own git-tracked copy of an entry,
especially when the original source is read-only.

If the provider call cannot be completed, the UI still navigates to the new entry's
detail page.
