---
id: updating
title: Updating range42
sidebar_position: 1
---

{/* migrated from range42/GETTING_STARTED.md "Updating range42" */}

range42 lives in 5 git repos. To update everything to latest:

```bash
range42-context init     # easiest - the wizard pulls all 5 repos before showing the menu
```

Or manually:

```bash
for repo in range42 range42-playbooks range42-catalog \
            range42-ansible_roles-proxmox_controller \
            range42-ansible_roles-debug-devkit; do
  echo "=== $repo ==="
  cd ~/range42/$repo && git pull
done
```

After updating, you may want to redeploy to apply role/playbook changes:

```bash
range42-context delete-vms      # keeps templates
range42-context deploy-vms      # redeploy with new code (~5 min)
```

If a role under `~/range42/range42/roles/` changed (e.g., `deployer.bootstrap`),
run the full `site.yml` again via `range42-context init` to rebuild the
deployer-cli config.
