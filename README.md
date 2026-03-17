# The Garage — Car Showcase Kiosk

Interactive car display application built for iPad kiosks and passive displays at Jacobs Entertainment. Built with Next.js 16, React 19, Prisma 6, and PostgreSQL.

## Features

- **Two display modes** — Interactive (iPad kiosk with touch) and Display (passive screen, auto-advances)
- **Media slideshow** — Images and videos with per-item transition effects (fade, zoom, pan, Ken Burns, slide)
- **Per-media captions** — Optional frosted-glass chat-bubble overlays on each slide
- **Story panel** — Slide-out panel with car story, highlights, and provenance info with auto-dismiss countdown
- **Admin editor** (`/admin`) — Full CRUD for marketing to manage cars, drag-and-drop media reordering
- **File uploads** — Upload images and videos directly from the browser (stored on server filesystem)
- **Entra ID auth** — Admin section protected by Microsoft Entra ID (Azure AD) SSO
- **PWA-ready** — Web manifest, standalone mode, Apple web app support for kiosk iPads

## Tech Stack

| Layer       | Technology                          |
| ----------- | ----------------------------------- |
| Framework   | Next.js 16.1.6 (App Router)        |
| UI          | React 19, Tailwind CSS 4           |
| Database    | PostgreSQL + Prisma 6              |
| Auth        | NextAuth v5 (Auth.js) + Entra ID   |
| Runtime     | Node.js, systemd service           |
| Proxy       | HAProxy (SSL termination)           |

## Local Development

### Prerequisites

- Node.js 20+
- PostgreSQL 14+ (running locally or accessible)

### Setup

```bash
# Clone the repo
git clone https://github.com/skyflyt/car-showcase.git
cd car-showcase

# Install dependencies
npm install

# Copy env file and fill in values
cp .env.example .env
# Edit .env with your DATABASE_URL and auth credentials

# Push schema to database
npx prisma db push

# Generate Prisma client
npx prisma generate

# (Optional) Seed with sample data
npm run seed

# Start dev server
npm run dev
```

The app runs at `http://localhost:3000` in development.

### Environment Variables

| Variable                   | Description                                      |
| -------------------------- | ------------------------------------------------ |
| `DATABASE_URL`             | PostgreSQL connection string                     |
| `UPLOAD_DIR`               | Absolute path for uploaded media files            |
| `AUTH_SECRET`              | NextAuth secret (generate with `openssl rand -base64 32`) |
| `AUTH_URL`                 | Public-facing URL (e.g. `https://garage.bhwk.com`) |
| `AUTH_TRUST_HOST`          | Set to `true` when behind a reverse proxy        |
| `AZURE_AD_CLIENT_ID`      | Entra ID app registration client ID              |
| `AZURE_AD_CLIENT_SECRET`   | Entra ID app registration client secret           |
| `AZURE_AD_TENANT_ID`      | Entra ID tenant ID                               |

## Server Deployment

This section documents the exact steps used to deploy to a production Ubuntu server behind HAProxy.

### 1. Create the service user and directories

```bash
sudo useradd -r -m -d /opt/car-showcase -s /bin/bash car-showcase
sudo mkdir -p /opt/car-showcase/app
sudo mkdir -p /opt/car-showcase/uploads
sudo chown -R car-showcase:car-showcase /opt/car-showcase
```

### 2. Clone the repo

```bash
sudo -u car-showcase git clone https://github.com/skyflyt/car-showcase.git /opt/car-showcase/app
```

### 3. Create the environment file

```bash
sudo nano /opt/car-showcase/.env
```

Add the following (fill in real values):

```env
DATABASE_URL="postgresql://car_showcase:YOUR_PASSWORD@localhost:5432/car_showcase"
UPLOAD_DIR="/opt/car-showcase/uploads"

AUTH_SECRET="GENERATE_WITH_openssl_rand_-base64_32"
AUTH_URL="https://garage.bhwk.com"
AUTH_TRUST_HOST=true

AZURE_AD_CLIENT_ID="your-client-id"
AZURE_AD_CLIENT_SECRET="your-client-secret"
AZURE_AD_TENANT_ID="your-tenant-id"
```

Protect the file:

```bash
sudo chown car-showcase:car-showcase /opt/car-showcase/.env
sudo chmod 600 /opt/car-showcase/.env
```

### 4. Set up PostgreSQL

```bash
sudo -u postgres psql
```

```sql
CREATE USER car_showcase WITH PASSWORD 'YOUR_PASSWORD';
CREATE DATABASE car_showcase OWNER car_showcase;
\q
```

### 5. Create the systemd service

```bash
sudo nano /etc/systemd/system/car-showcase.service
```

```ini
[Unit]
Description=Car Showcase
After=network.target

[Service]
Type=simple
User=car-showcase
Group=car-showcase
WorkingDirectory=/opt/car-showcase/app
ExecStart=/usr/bin/npm run start
Restart=on-failure
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3100
EnvironmentFile=/opt/car-showcase/.env

[Install]
WantedBy=multi-user.target
```

Enable the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable car-showcase
```

### 6. Install the deploy script

```bash
sudo cp /opt/car-showcase/app/deploy.sh /opt/car-showcase/deploy.sh
sudo chmod +x /opt/car-showcase/deploy.sh
```

### 7. Run initial deploy

```bash
sudo /opt/car-showcase/deploy.sh
```

This will: pull latest code, install deps, generate Prisma client, push schema to DB, build the app, and restart the service.

### 8. Configure HAProxy

Add to your HAProxy config (typically `/etc/haproxy/haproxy.cfg`):

```haproxy
frontend https_front
    bind *:443 ssl crt /path/to/cert.pem
    acl host_garage hdr(host) -i garage.bhwk.com
    use_backend garage_back if host_garage

backend garage_back
    server jeinodejs1 127.0.0.1:3100 check
```

```bash
sudo systemctl reload haproxy
```

### 9. Configure Entra ID (Azure AD)

1. Go to [Azure Portal](https://portal.azure.com) → Microsoft Entra ID → App registrations
2. Create a new registration:
   - **Name:** The Garage
   - **Supported account types:** Single tenant
   - **Redirect URI:** Web — `https://garage.bhwk.com/api/auth/callback/microsoft-entra-id`
3. Under **Certificates & secrets**, create a new client secret
4. Copy the **Application (client) ID**, **Directory (tenant) ID**, and the **secret value** into your `.env` file

### Subsequent Deploys

After pushing changes to `main`:

```bash
# SSH into the server
ssh user@jeinodejs1

# Run the deploy script
sudo /opt/car-showcase/deploy.sh
```

The deploy script handles everything: git pull, npm ci, prisma generate, prisma db push, build, and restart.

## URL Reference

| URL                         | Description                   |
| --------------------------- | ----------------------------- |
| `/`                         | The Garage — car grid         |
| `/car/{slug}`               | Car display (uses DB default mode) |
| `/car/{slug}?mode=display`  | Force passive display mode    |
| `/car/{slug}?mode=interactive` | Force interactive kiosk mode |
| `/admin`                    | Admin dashboard (auth required) |
| `/admin/cars/new`           | Add a new car                 |
| `/admin/cars/{id}/edit`     | Edit an existing car          |

## Display Mode Tips

- **Interactive mode:** Designed for iPad kiosks. Tap anywhere to open the story panel. Touch the slideshow to pause.
- **Display mode:** Designed for passive screens (TVs, monitors). Auto-advances slides, periodically shows the story panel, then auto-dismisses after countdown.
- Set the default mode per car in the admin editor, or override via URL query parameter.
- The `slideshowIntervalMs` setting controls how long each slide is shown (default: 6 seconds).
- The `storyDismissSeconds` setting controls the auto-dismiss countdown in display mode (default: 30 seconds).

## Media Settings

Each media item in a car's slideshow can have:
- **Transition effect** — Choose from fade, zoom in/out, pan left/right, slide left/right, or Ken Burns (random). Set per-item or set a default for the entire car.
- **Caption** — Optional text overlay that appears as a frosted-glass bubble on the slide.
- **Drag-and-drop reordering** — Drag thumbnails in the admin media tab to reorder slides.

## Project Structure

```
├── prisma/
│   ├── schema.prisma        # Database schema
│   └── seed.ts              # Sample data seeder
├── public/
│   ├── icon.svg             # Favicon
│   └── site.webmanifest     # PWA manifest
├── src/
│   ├── app/
│   │   ├── admin/           # Admin CRUD pages (auth-protected)
│   │   ├── api/             # API routes (cars, upload, uploads, auth)
│   │   ├── auth/            # Auth sign-in page
│   │   ├── car/[slug]/      # Car display page
│   │   ├── layout.tsx       # Root layout with metadata
│   │   ├── page.tsx         # Home page — The Garage
│   │   ├── error.tsx        # Error boundary
│   │   ├── not-found.tsx    # 404 page
│   │   └── loading.tsx      # Loading spinner
│   ├── components/
│   │   ├── AdminCarForm.tsx  # Car editor form with media management
│   │   ├── CarDisplay.tsx    # Main car display component
│   │   ├── Slideshow.tsx     # Media slideshow with transitions
│   │   └── StoryPanel.tsx    # Slide-out story/info panel
│   └── lib/
│       ├── auth.ts          # NextAuth config (Entra ID provider)
│       ├── db.ts            # Prisma client singleton
│       └── types.ts         # TypeScript interfaces
├── deploy.sh                # Production deploy script
└── .env.example             # Environment variable template
```
