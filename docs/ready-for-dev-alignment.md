# Align fran-mobile to Figma Ready for Dev (keep present tokens)

**Figma (current):** [fran-app (aug26) - wip](https://www.figma.com/design/lUTIEfH8vnd6rPLr1IogYx/fran-app--aug26---wip-?node-id=0-1&m=dev) — fileKey `lUTIEfH8vnd6rPLr1IogYx`, page `0:1`.

Shipped from this file: Member ID, You, Rewards (`45:1088` / `45:3797`), new-user login (`40:3176` / `40:2418`). Keep present tokens.

**Superseded:** LISE App `mwit2fthu3gfcXh2okg3G1` (Ready `565:7073` and Ready for Dev `203:1708`). Do not implement from those.

**Visual source of truth:** **this repo's present theme** — do not rematch Figma hex or typefaces

**Repo:** Expo 56 / RN 0.85 Fran prototype

Constraints:

- **Colour + font:** keep `src/theme` as-is (`#FFE14D`, `#FFFEF5`, `#3A2415`, Platform display + Symbol body). Paint Ready-for-Dev *layout* with current tokens.
- **Flow:** Ready for Dev is priority. That section is one composed shell (`AppShell/Home` `203:1710`). The rest of the same IA lives next door in Working Screens (`Shell/Home`, `Shell/GRWM`, `Shell/PDP`). Do not implement the later Ready canvas (`565:7073` guest LISE + skin-analysis home) first.

---

## Source of truth

| Figma section | Role | Use? |
|---|---|---|
| **Ready for Dev `203:1708`** | `AppShell/Home`: yellow header, Beauty Club, LISE Besties, GRWM sliders, FooterNavBar | **Priority flow** |
| **Working Screens `128:858`** | `Shell/Home`, `Shell/GRWM`, `Shell/PDP` — same IA, more screens | **Priority flow (tabs + PDP)** |
| Catalog Filters `102:1984` | Listing + filter variants | After Catalog tab exists |
| Key App Flow `75:521` | Wishlist, store locator, orders, bundle PDP, older Profile | After the three shells |
| Ready `565:7073` | Guest home, skin analysis recs, login colour-season | Later / not this pass |
| Unassigned WIP | Notifications, help, language, reviews, feedback form | Backlog |

Figma Ready-for-Dev uses Manrope + `#FCDD00` / slate greys. **Ignore those.** Map every surface onto present Fran yellow / cream / brown / Symbol.

---

## Target IA (from FooterNavBar)

Replace current tabs:

| Today | Ready for Dev |
|---|---|
| Discover | **Home** |
| Profile | **GRWM** |
| Member ID (center QR) | **Center mascot** (yellow circle; barcode lives in the *header*) |
| Vouchers | **Catalog** |
| Account | **Profile** |

Header (Home): scan/barcode left · LISE wordmark center · heart + count right.

Do **not** float the current 64pt capsule bar if it fights this chrome — but keep present colors, icons where they still read, and Symbol labels.

---

## What already exists vs this flow

| Ready-for-Dev / Working Screens | Repo today | Aligned? |
|---|---|---|
| `AppShell/Home` Beauty Club card (TIER STARTER, 0/75 pts to INSIDER, gift, resets 365d) | `ProfileScreen` tier card (spend-to-unlock, T1–T3) | **No** — different metric (pts-to-tier vs yearly spend) and it is not on Home |
| Discover LISE Besties (story rings + “Up to 10% off”) | Nothing | **Missing** |
| GRWM Bundles slider + VIEW ALL | Discover “Exclusive bundles” list (wrong dest, no photos) | **Missing** |
| Second product/PDP image slider | Nothing | **Missing** |
| `Shell/GRWM` (search, big bundle cards, What Your Friends Buy) | No GRWM tab | **Missing** |
| `Shell/PDP` (image, brand/price, rating, review slider, description, ingredients) | No shop/PDP | **Missing** |
| Catalog tab | No catalog | **Missing** |
| Wishlist (header heart + `4:1437`) | Nothing | **Missing** |
| Header barcode / scan | `MemberIdScreen` as a tab | **Wrong place** |
| Yellow full-bleed Home header | Cream `Screen` + logo-left Discover header | **Not aligned** |
| Loyalty: points, check-in, voucher wallet, quizzes, account | Implemented | **Keep** — move under Profile / Account, not Home |
| Onboarding / OTP | Implemented | **Keep** — out of Ready-for-Dev; no need to rebuild as colour-season login this pass |

---

## What not to do this pass

- Do **not** remap theme tokens to Figma `#FEDE02` / `#F7F5F2` / `#402A1D` / Manrope.
- Do **not** make guest skin-analysis home (`573:7572` / `565:7074`) the default.
- Do **not** restyle Discover into the older `fran with benefits` rewards canvas.
- Do **not** import Material 3 / Code Connect chips from Figma. Use `ui.tsx`.
- Hide `TypographySelector` behind `__DEV__` only (not a design-token change).

---

## Implementation order

### PR 1 — Shell only (tokens stay)

- Tab IA: Home / GRWM / center / Catalog / Profile.
- Home header: barcode → existing Member ID; heart → wishlist (can stub count).
- LISE wordmark in header, painted with present yellow (`colors.yellow`) and brown ink — do not swap the whole palette.
- Flatten or restyle tab bar to match FooterNavBar *structure* (labels Home/GRWM/Catalog/Profile, yellow center). Keep Fran yellow/brown.
- Files: `RootNavigator.tsx`, header component, `FranLogo.tsx` usage.

### PR 2 — Home = Beauty Club + Besties + GRWM rails

- New `HomeScreen` replacing Discover as the first tab.
- Beauty Club card: map to existing `user.tier` / `user.points` (Starter / 0 of 75 to Insider). Use present cream/yellow/brown, not Figma slate progress.
- LISE Besties horizontal stories (mock creators + yellow rings using `colors.yellow`).
- GRWM bundle cards with **Figma-exported photos** (do not invent images).
- Move check-in / promo-banner Discover content off Home (keep reachable from Profile or a later module).
- Files: `src/screens/home/HomeScreen.tsx`, `src/components/` cards, `src/data/bundles.ts`.

### PR 3 — GRWM tab (`23:500`)

- Search bar, featured big bundle, Besties widget, second featured, “What Your Friends Buy”.
- VIEW ALL from Home lands here.
- Files: `src/screens/grwm/GrwmScreen.tsx`.

### PR 4 — PDP (`317:1632`)

- Product image, primary/secondary CTAs, brand + name + price/compare-at, rating + review count, review slider, description + read more, key ingredients.
- Wire bundle/product cards → PDP.
- Files: `src/screens/pdp/PdpScreen.tsx`, mock `src/data/products.ts`.

### PR 5 — Catalog tab

- Listing + filters from `102:1984`, same product card language as PDP thumbs.
- Files: `src/screens/catalog/CatalogScreen.tsx`.

### PR 6 — Relocate loyalty (do not delete)

- Profile tab absorbs: tier (or deep-link from Beauty Club), vouchers, earn, quizzes, account settings.
- Member ID opens from header barcode (modal or stack), not its own tab.
- Fix known stubs only when touching those files (broken txn icons, no-op copy).

### PR 7 — Later (not Ready for Dev)

- Guest analysis home, colour-season login, notifications, help, reviews hub, language, maps.

---

## Token mapping rule (present → Figma roles)

When implementing Ready-for-Dev layout, substitute:

| Figma (ignore hex/face) | Use in repo |
|---|---|
| `#FCDD00` header / rings / VIEW ALL | `colors.yellow` |
| `#F8F8F5` page | `colors.background` / `colors.cream` |
| `#2D2D2D` titles | `colors.ink` |
| `#64748B` captions | `colors.muted` |
| Manrope Bold / Regular | `fonts.bodyBold` / `fonts.body` (Symbol); Platform only for display numerals if needed |
| Slate progress fill | `colors.brown` or `colors.tan` track, yellow or brown fill |

---

## Success check

1. First tab is Ready-for-Dev Home (Beauty Club + Besties + GRWM rails), not Fran Discover.
2. Tabs read Home / GRWM / center / Catalog / Profile.
3. Header barcode opens Member ID; heart is wishlist (even if stub).
4. GRWM and PDP match Working Screens structure.
5. Palette and type still look like today’s Fran app — no Manrope, no `#FCDD00` / slate restyle.
6. Existing OTP, vouchers, quizzes, account still work, just not as the home IA.

---

## Open question

Center control in Ready for Dev is a **yellow smiley**, not a QR. Header already has barcode. Confirm: center = mascot/home-scan, and Member ID stays on the barcode — or keep today’s QR in the center and drop the smiley.
