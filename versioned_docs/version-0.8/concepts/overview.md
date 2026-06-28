---
id: overview
title: Overview
sidebar_position: 1
---

{/* migrated from range42/README.md "About the project" / "Who it's for" / "Project mid / long term goals" */}

## Who it's for

- **Sysadmins** — practice securing vulnerable stacks and test hardening procedures
- **SOC analysts / blue teams** — validate detection rules, tune alerts, test incident response
- **Red teamers / researchers** — build exploit chains, study CVEs in controlled environments
- **Forensics teams** — reconstruct incidents, analyse compromised systems

## Project mid / long term goals

The goal is to cover the full spectrum of cyber training. Here's where the project stands today and where it's heading.

**Status legend:** **shipping** = production-tested · **early** = working, content to grow · **partial** = code in place, currently disabled · **planned** = on the roadmap

| Use case | Status | What range42 brings |
|----------|--------|---------------------|
| **Network labs** | shipping | Empty multi-subnet bases (`blank_scenario_2/4/6_subnets`) ready for you to install your own workloads on top |
| **Defensive training** | shipping | Wazuh-instrumented infrastructure via `demo_lab`, ready for detection-engineering and rule-tuning exercises |
| **Offensive training** | early | Vulnerable hosts and misconfigured services in `demo_lab`; an extensible catalogue of CVEs and product setups **will** grow over upcoming releases |
| **Student workstations** | partial | Group structure in place; the `03_student_infrastructure` block is currently disabled and **will** be re-enabled once stabilised |
| **Hybrid (red / blue)** | planned | One lab, both perspectives, scoreboard and full visibility on both sides |
| **Forensics & IR** | planned | Reproducible compromised environments for rebuild-and-investigate exercises |
