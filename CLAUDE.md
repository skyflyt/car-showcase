# Car Showcase

## Deployment (Coolify on jeinodejs1)

This app is deployed via Coolify on the JEI infrastructure.

| Detail | Value |
|--------|-------|
| Coolify Manager | jeicoolify (10.0.2.61) — UI at http://10.0.2.61:8000 |
| Build/Run Host | jeinodejs1 (10.0.2.99) |
| App UUID | `600e94af-1554-4576-9774-3fc8127f889f` |
| Build Pack | Nixpacks (see `nixpacks.toml`) |
| Port | 3100 (host-mapped) |
| Domain | `garage.bhwk.com` (routed via HAProxy → 10.0.2.99:3100) |
| Database | PostgreSQL `car_showcase` on jeinodejs1 (user: `car_showcase`) |
| GitHub Repo | skyflyt/car-showcase (branch: main) |
| Manual Webhook Secret | `1b139bedda8bce00e9f0b9b9d5031706` |

### Auto-Deploy

Coolify supports a 5-minute cron-based auto-deploy that triggers a webhook to check for new commits. When set up, it runs on jeicoolify at `/opt/coolify-autodeploy-carshowcase.sh` and fires via cron every 5 minutes. If the branch has new commits, Coolify rebuilds and redeploys automatically.

To trigger a manual deployment:
```bash
SSH_KEY="$TEMP/jeiadmin_nopass"
ssh -i "$SSH_KEY" jeiadmin@10.0.2.61 "sudo bash /opt/coolify-autodeploy-carshowcase.sh"
```

### Environment Variables

Set in Coolify (not in repo). Key vars:
- `PORT=3100`
- `DATABASE_URL` — uses `10.0.2.99` as host (not localhost — container can't reach host via localhost)
- `UPLOAD_DIR=/app/uploads` — mapped to host path `/opt/car-showcase/uploads` via Coolify persistent volume

### Persistent Storage

Uploads are stored in a Coolify persistent volume:
- **Host path:** `/opt/car-showcase/uploads`
- **Container path:** `/app/uploads`

This survives container redeployments. The volume is configured in Coolify's `local_persistent_volumes` table.

### Architecture Notes

- Next.js 16 with Prisma ORM
- `npm start` runs `next start -p 3100`
- Prisma schema has a single `Car` model
- HAProxy handles SSL termination; Coolify container gets plain HTTP
- PostgreSQL on jeinodejs1 (not in Docker) — `pg_hba.conf` has entry for `172.16.0.0/12` to allow Docker container access
- `npx prisma generate` runs at build time (configured in `nixpacks.toml`)
