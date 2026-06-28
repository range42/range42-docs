---
id: contributing
title: Contributing & Canonical Sources
sidebar_position: 100
---

# Contributing & Canonical Sources

## Canonical-source policy

The Range42 ecosystem is spread across several repositories (`range42-backend-api`,
`range42-deployer-ui`, `range42-catalog`, `range42-playbooks`, and others). **The
authoritative copy of any document lives in its home repository**, not here.

This documentation site holds a **curated public copy** — content that has been
reviewed, restructured for readability, and published for end-users and operators. When
the upstream source changes, the docs site must be updated manually to stay in sync.

### What this means in practice

- If you find an error in a page that was migrated from another repo (e.g., an
  architecture overview, a CLI reference), **check the upstream repo first**. The
  mistake may already be fixed there.
- When you edit a migrated page here, consider whether the fix also needs to land in
  the source repo so the two do not drift apart.
- Pages authored directly in `range42-docs` (like this one) are owned here; no upstream
  to check.

### Identifying migrated pages

Migrated pages include an HTML/MDX source comment (invisible in the rendered output)
identifying the upstream repository they were migrated from. If a page has no such
comment, it was authored in this repo. Before editing a migrated page, check the
upstream repo for the latest changes to avoid re-introducing issues already fixed there.

## How to contribute

See [CONTRIBUTING.md](https://github.com/range42/range42-docs/blob/main/CONTRIBUTING.md)
for the full workflow: edit → preview → PR → review → auto-deploy.
