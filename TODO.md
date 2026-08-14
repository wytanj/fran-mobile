# Handoff — 15 Aug 2026 (updated)

Read this first. **Figma SoT is the Ready page, not Ready for Dev.**

Do **not** rematch Figma hex/Manrope. Do **not** deploy unless asked.

## Figma source of truth (locked)

**Page: Ready** — https://www.figma.com/design/mwit2fthu3gfcXh2okg3G1/LISE-App--WIP-?node-id=565-7073

- fileKey `mwit2fthu3gfcXh2okg3G1`
- node `565:7073` (canvas name **Ready**)
- Key frames: guest home `573:7572`, login `573:7301`, recs home `565:7074`, analysis sheet `573:6654`

**Do not implement from** Ready for Dev `203:1708` (yellow barcode header, Beauty Club, Besties stories). That was an earlier pass and is superseded.

Colours/fonts stay `src/theme` (Fran yellow `#FFE14D`, cream, brown, Platform + Symbol).

Use Figma MCP `get_design_context` on Ready nodes + skill `figma-design-to-code`.

## Project

- Expo **56** / RN **0.85**. Package `com.fran.mobile`.
- Web: https://fran-mobile.vercel.app
- Plan file `docs/ready-for-dev-alignment.md` is **historical** — Ready page wins if they conflict.
- `AGENTS.md` Expo v57 docs vs installed 56: prefer 56.
- `faqs.csv` untracked — leave it.

## Shipped on Ready (this session)

- Guest-first: Main tabs open without login. **Log in** in header → Onboarding stack.
- Ready header: logo left, Log in or tier·pts chip, search, bell (not yellow barcode bar).
- Home = FIND YOUR SKIN TYPE teal CTA, trending chips + products, this week’s drop, promo pair.
- Logged-in Home adds greeting + skin profile block when a skin quiz exists.
- Center tab is **QR** (Ready), not the Ready-for-Dev smile. Profile / QR require auth.

## Still open on Ready

- Login chrome `573:7301` (colour-season card) — still old Welcome/Phone stack.
- Analysis sheet `573:6654` (OILY SKIN overlay) — quiz still uses old results table.
- Tab labels in Figma are still “You” placeholders — we kept Home / GRWM / Catalog / Profile.
- Add-to-bag no-op. Notifications screen is a stub.
- Android internal APK (`eas.json` not added yet).

## Next (pick one)

1. Ready login + analysis sheet (`573:7301`, `573:6654`)
2. Android internal APK: `eas build --platform android --profile internal`

## Start prompt

```
Continue from TODO.md. Figma SoT is Ready 565:7073 (not Ready for Dev). Keep Fran tokens. Next: <login/analysis or Android APK>.
```
