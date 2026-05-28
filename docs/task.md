# Tasks: Codebase Optimization & Responsive Stabilization

- [x] Compress still image asset `hero.png` -> `hero.webp` (reduced 2.34 MB -> 101.8 KB)
- [x] Compress muted background video `hero-video.mp4` by speeding up 2x, stripping audio (reduced 2.37 MB -> 728.2 KB)
- [x] Create mobile square video `hero-video-mobile.mp4` (488 KB) and square WebP poster `hero-mobile.webp` (65.3 KB)
- [x] Re-configure Prisma for SQLite database development fallback
- [x] Clean up unused template scaffolding files (`lib/types.ts` and `lib/db.ts`)
- [x] Remove Next.js custom webpack outputOverrides from `next.config.js` to resolve dev server 404 chunks
- [x] Fix aspect-ratio dimensions on HTML5 `<video>` using responsive attributes to avoid Cumulative Layout Shift (CLS)
- [x] Implement responsive above-the-fold WebP image preloading in `<head>` (using `media` queries and `fetchPriority="high"`)
- [x] Stabilize Portrait Mobile CSS with aspect-square top flex stack and centered bottom glass-card
- [x] Perform Playwright emulated iPhone 14 Pro DOM audit (0 errors, 0 warnings)
- [x] Compile Next.js production build (`npm run build`) successfully
