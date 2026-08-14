# Handoff — 15 Aug 2026

**Figma SoT is now `fran-app (aug26) - wip`, not the LISE file.**

https://www.figma.com/design/lUTIEfH8vnd6rPLr1IogYx/fran-app--aug26---wip-?node-id=0-1&m=dev

- fileKey `lUTIEfH8vnd6rPLr1IogYx`
- start node `0:1` (document page)
- Work only from this file’s **Ready** frames. Ignore LISE `mwit2fthu3gfcXh2okg3G1` and Ready for Dev `203:1708`.

Colours/fonts stay `src/theme` (Fran yellow `#FFE14D`, cream, brown, Platform + Symbol). Do not rematch Figma hex/Manrope. Do not deploy unless asked.

## Blocker (must fix before more design-to-code)

Two independent blockers. **Both** must clear — connecting the MCP still hits the seat error, and upgrading the seat is untestable while the MCP is unreachable.

### 1. Figma MCP is not connected to Claude Code

Checked 14 Aug 2026. The `figma` plugin is enabled for **Cursor only** (`.cursor/settings.json`); Claude Code has no Figma server registered (global `mcpServers` is empty, no `.mcp.json`). The local Dev Mode endpoint (`127.0.0.1:3845`) is also down because Figma desktop isn't running, and `www.figma.com/design/...` over plain HTTP returns only the SPA shell. So from Claude Code there is currently *no* path to this file.

To fix, either launch Figma desktop with Dev Mode MCP enabled (serves `127.0.0.1:3845`), or register the remote server and authorize it in an **interactive** session (`claude mcp add --transport http figma https://mcp.figma.com/mcp`, then `/mcp` to run OAuth). OAuth cannot be completed from a non-interactive run.

### 2. Seat is View-only (unresolved from the previous session)

Figma MCP is logged in as **Jeremy** (`jeremy@heyfran.com`) with a **View** seat. Every tool on this file fails:

> Looks like you don't have edit access to this file. The file owner can share it with you and make you an editor.

Share the file with `jeremy@heyfran.com` as **can edit** (Dev/Full seat). Then: `get_metadata` on `0:1`, find Ready, `get_design_context` + `figma-design-to-code`, refactor Home/header/nav/login.

## Project

- Expo **56** / RN **0.85**. Package `com.fran.mobile`.
- Web: https://fran-mobile.vercel.app
- `docs/ready-for-dev-alignment.md` is historical.
- `faqs.csv` untracked — leave it.

## Fran-app Page 1 (current)

Working from **Member ID** (`1:4296` Scan & earn) and **You** (`1:4354` / guest `1:4635`). WIP strip left alone.

## What’s in the app today (older LISE Ready draft still on Home)

- Guest-first tabs, cream header (Log in / pts, search, bell)
- Home: skin-type CTA, trending, drop, promos
- GRWM / Catalog / PDP / Wishlist still present
- Center QR; Profile/QR gated on auth

Treat that as a draft to replace from the new file, not as SoT.

## Next

1. Unlock Figma edit access
2. Inventory Ready frames in `lUTIEfH8vnd6rPLr1IogYx`
3. Refactor UI to those frames
4. Android internal APK after that (no `eas.json` yet)

## Start prompt

```
Continue from TODO.md. Figma SoT is fran-app aug26 lUTIEfH8vnd6rPLr1IogYx (node 0:1). Keep Fran tokens. Pull Ready via MCP and refactor. Do not use the LISE file.
```
