# Mobile QA Checklist — Mafia Game Role Allocator

Date: 2025-09-29
Environment:
- Node: 20.12.1 (local) — Vite dev server requires 20.19+; used static server
- Serve: static dist server (`npm run serve:dist`)
- URL: http://localhost:5176 (auto-incremented from 5173)

## Lighthouse (Mobile) — Snapshot
- Performance: 1.00 (100)
- Accessibility: 0.86 (86)
- Best Practices: 1.00 (100)
- SEO: 0.82 (82)

Artifacts:
- HTML: performance/reports/mobile.report.html
- JSON: not captured in this run

Key audits (pass/fail/notes):
- FCP/LCP/CLS targets: FCP 1.2s, LCP 1.3s, CLS 0.00 — PASS (budgets: FCP≤1.5s target, LCP≤2.5s target, CLS≤0.1 target)
- TBT/TTI/TTFB: TBT 0ms, TTI 1.3s, TTFB ~452ms — PASS
- Total transfer size: ~52 KiB — PASS (budget: initial ≤350KB warn/≤450KB error)
- Largest files: vendor ~45,830B; app JS ~2,184B; CSS ~2,976B — PASS
- Viewport meta correct (width=device-width, initial-scale=1.0, viewport-fit=cover) — PASS
- Uses passive listeners — PASS
- Tap targets ≥ 44px — N/A in audit; manual check pending
- Color contrast — FAIL (text-sm text-green-600 paragraph flagged)
- Render-blocking CSS — INFO (index.css ~3KB; ~152ms potential; negligible impact)
- Security headers (CSP/HSTS/COOP/XFO/Trusted Types) — INFO for localhost
- robots.txt validity — FAIL (localhost served HTML; expected for static preview)
- Meta description — FAIL (missing). Consider adding in index.html for SEO checks

## Manual Device Checks (Mobile)
- Launch & render under 2s on mid device: pending
- Buttons respond <200ms: pending
- Safe areas respected (notch/home bar): pending
- Double-tap idempotency (Allocate/Reveal/Reset): pending
- Sequential reveal enforcement: pending

## Notes
- Consider adjusting text color for better contrast (fix the green text to meet WCAG AA).
- Add a meta description tag in index.html for SEO parity in audits.
- robots.txt errors are expected when testing localhost/static preview; not actionable for this frontend-only app.
