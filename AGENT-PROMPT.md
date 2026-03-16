# Car Showcase Kiosk App — Code Agent Continuation Prompt

## Context
This is a Next.js 15 app designed to run on 13-inch iPads in kiosk mode, displaying high-end cars on the casino floor for Jacobs Entertainment. The foundation is built — you're picking up from here.

**Repo:** https://github.com/skyflyt/car-showcase
**Stack:** Next.js 15, TypeScript, Tailwind CSS 4, App Router
**Target device:** iPad Pro 12.9" (1024x1366 logical, 2048x2732 physical) in landscape, kiosk mode
**URL pattern:** `/car/[slug]` — each car gets its own page, each iPad points at one URL

## What's Built
- `/car/[slug]/page.tsx` — fullscreen slideshow with gradient overlay, car title, stats strip
- `Slideshow.tsx` — auto-advancing image carousel (6s interval), crossfade transitions, tap left/right to navigate, auto-resumes after 15s idle
- `StatsPanel.tsx` — expandable stats bar (shows 5 stats, tap to reveal all)
- `src/data/cars.ts` — data file with the 2008 Lamborghini Reventón (65+ images, full specs, history, auction info)
- `src/lib/types.ts` — TypeScript interfaces for CarData, CarStats, AuctionInfo
- Home page (`/`) — card grid of all cars for admin/selection
- Images served from cdn.rmsothebys.com (external, unoptimized)

## What Needs To Be Done

### Priority 1: Visual Polish for Kiosk
1. **Optimize for iPad 12.9" landscape (1024x1366 landscape = 1366x1024)**
   - Test and tune all font sizes, padding, and layout for this exact viewport
   - Images should fill the entire screen edge-to-edge with `object-cover`
   - The gradient overlay + title + stats should feel like a luxury car configurator, not a website

2. **Slideshow improvements**
   - Smooth Ken Burns effect (subtle slow zoom/pan on each image) for visual interest
   - Crossfade transition (not opacity toggle — true dual-layer crossfade)
   - Preload next 2-3 images for seamless transitions
   - Consider grouping: exterior shots → interior shots → detail shots → documents (if image metadata allows)

3. **Typography**
   - Import a premium font pairing: something like Inter + a display serif for the car name
   - The year should be subtle, the make bold, the model in elegant italic
   - Stats should use tabular/monospace numbers for alignment

4. **Ambient touches**
   - Subtle particle effect or gradient animation in the background behind images (very subtle, not distracting)
   - Consider a "breathing" animation on the Jacobs Entertainment watermark
   - Smooth scroll indicator dots that fill/animate as slideshow progresses

### Priority 2: Interactive Stats/Info Mode
1. **Swipe-up or tap gesture to enter "Info Mode"**
   - Full-screen overlay (dark, semi-transparent) with:
     - Car description text (from `car.description`)
     - Highlights list (from `car.highlights`)
     - All stats in a grid layout
     - Auction info panel (house, event, lot, sold price, chassis)
   - Swipe down or tap to dismiss back to slideshow
   - Auto-dismiss after 30s of no interaction

2. **Stats animations**
   - When stats first appear or info mode opens, animate the numbers counting up
   - "670 hp" should count from 0 to 670, "211 mph" should count from 0 to 211, etc.
   - Use spring/easing animations (framer-motion or CSS)

### Priority 3: Multi-Car Infrastructure
1. **Adding new cars should be dead simple**
   - Just add a new entry to `src/data/cars.ts` with slug, images, stats
   - Consider a JSON schema or admin form in the future
   - Document the process in README

2. **Home page improvements**
   - The `/` page should be styled as an admin selector (not public-facing)
   - Show car count, last updated, QR code for each car's kiosk URL
   - Add a "copy kiosk URL" button for each car

### Priority 4: Production Readiness
1. **PWA / Kiosk mode support**
   - Add manifest.json for "Add to Home Screen" on iPad
   - Hide Safari UI elements
   - Prevent pull-to-refresh, pinch-to-zoom, and other Safari gestures
   - `apple-mobile-web-app-capable` meta tag
   - Fullscreen API if available

2. **Image optimization**
   - Download and serve images locally (or via our own CDN) instead of hotlinking rmsothebys.com
   - Generate responsive sizes for bandwidth efficiency
   - Consider WebP → AVIF conversion

3. **Offline support**
   - Service worker to cache all images after first load
   - App should work fully offline once cached (kiosk may have spotty wifi)

4. **Error handling**
   - Graceful fallback if an image fails to load (skip to next)
   - Network error state that auto-retries

## Design References
- Think: Tesla configurator, Porsche car pages, luxury watch brand sites
- Dark theme only (black background, white/grey text)
- Minimal UI chrome — the car photos are the star
- Motion should be smooth and intentional, never janky
- No scrolling — everything fits in viewport or uses gestures/overlays

## Technical Notes
- The app will be deployed on jeinodejs1 behind HAProxy (same setup as Launchpad)
- URL will be something like `cars.bhwk.com/car/2008-lamborghini-reventon`
- `next.config.ts` already has `remotePatterns` for cdn.rmsothebys.com
- The `kiosk-mode` CSS class on body disables text selection and callouts
- Build verified passing: `npm run build` succeeds

## Don't
- Don't add authentication — this is a public display
- Don't add a CMS or database — flat file data is fine for now
- Don't over-engineer — this is a display kiosk, not a web app
- Don't remove any existing images from the data file
- Don't change the URL routing pattern (`/car/[slug]`)