# Handoff — 15 Aug 2026

Read this first in a new session. Do **not** rematch Figma hex/Manrope. Do **not** deploy unless asked. Next real work is the **Android internal APK** (POS, not Play Store).

## Project

- Repo: `fran-mobile` — Expo **56** / RN **0.85** / React 19.2 loyalty + shop prototype.
- Brand in code: **Fran**. Figma file is **LISE App (WIP)**.
- Package: `com.fran.mobile` (`app.json`). Keep it stable.
- Web prod: https://fran-mobile.vercel.app
- Tip of `master`: `89a17da` (Ready-for-Dev flow). Plan doc: `docs/ready-for-dev-alignment.md`.
- Workspace rule `AGENTS.md` points at Expo **v57** docs; the **installed SDK is 56**. Prefer 56 behaviour when they conflict.
- `faqs.csv` is untracked and unrelated — leave it.

## Locked decisions

1. **Colours + fonts:** current `src/theme` (`#FFE14D`, `#FFFEF5`, `#3A2415`, Platform + Symbol). Paint Figma *layout* with these.
2. **Flow SoT:** Figma [Ready for Dev](https://www.figma.com/design/mwit2fthu3gfcXh2okg3G1/LISE-App--WIP-?node-id=203-1708) (`203:1708`) + Working Screens (`128:858`).
3. **Not this pass:** later Ready canvas `565:7073` (guest skin-analysis home, colour-season login).
4. **Android POS:** internal **APK**, sideload / MDM. No Play Store, no AAB.

## Shipped (do not redo)

Tabs: **Home / GRWM / smile / Catalog / Profile**. Flat tab bar. Yellow shop header (barcode → Member ID, heart → wishlist).

New: `HomeScreen`, `GrwmScreen`, `CatalogScreen`, `PdpScreen`, `WishlistScreen`, `ShopHeader`, `ProductCard`, `src/data/catalog.ts`, Figma photos in `assets/catalog/`.

Loyalty kept as stack from Profile (Discover check-in, Vouchers, account, log out). Member ID is a stack screen. Type dock is `__DEV__` only.

Figma MCP is configured as `figma` → `https://mcp.figma.com/mcp` (OAuth in `~/.grok/mcp_credentials.json`). Use `figma-design-to-code` before `get_design_context`. fileKey `mwit2fthu3gfcXh2okg3G1`.

## Do next — Android internal APK

No `eas.json` yet. No `expo-dev-client`. Cloud EAS does **not** need Studio/JDK. Local `expo run:android` does.

**Machine (Windows, local builds only)**
- JDK **17** (Microsoft OpenJDK 17). Not 8/11/21.
- Latest Android Studio + **SDK Platform 36** (compile). App still runs Android 7+.
- `JAVA_HOME`, `ANDROID_HOME` = `%LOCALAPPDATA%\Android\Sdk`, `platform-tools` on Path.

**Steps**
1. `npm i -g eas-cli` → `eas login` → `eas build:configure`
2. Add profile `internal`: `"distribution": "internal"`, `android.buildType: "apk"`
3. `eas build --platform android --profile internal`
4. Keep the generated keystore. Same package + keystore = in-place updates on tills.
5. Install: EAS URL / QR (allow unknown apps) or `adb install app.apk`
6. Bump `expo.version` per store drop

Optional later: `expo-dev-client` + `npx expo run:android` for USB debug.

## Figma leftovers (after APK, if asked)

Catalog filter polish (`102:1984`). Bundle PDP. Real QR. Notifications / help / language. Guest analysis home (`565:7073`). Add-to-bag is a no-op.

## Open product question

Center tab is a yellow **smile** that opens Member ID (same as header barcode). Confirm if that stays.

## How to start tomorrow

```
Continue from TODO.md. Next: add eas.json internal APK profile and run eas build --platform android --profile internal. Do not rematch Figma tokens. Do not deploy web unless asked.
```
