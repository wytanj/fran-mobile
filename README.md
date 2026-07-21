# Fran Mobile

Loyalty & shopping app for **Fran**, a beauty retail chain. Built with **Expo + React Native + TypeScript**.

- Product UX: `startingui.pdf`
- Brand system (colour, type, logo): `brandworld.pdf` · logo **Option 2C** in `assets/logo-2c.png`

### Brand tokens
| Role | Value |
|------|--------|
| Yellow | `#FFE14D` |
| Pale yellow | `#FFF4A8` |
| Sky blue | `#5BBFE0` |
| Cream | `#FFFEF5` |
| Peach / tan / brown | `#F2D2AE` · `#C4A070` · `#3A2415` |
| Display type | Marr Sans Condensed → **Barlow Condensed** |
| Body type | Symbol → **DM Sans** |

## Quick start

```bash
npm install
npm start
```

Then press `a` (Android), `i` (iOS simulator), or scan the QR with Expo Go.

## Prototype auth

- **Sign up / Log in** use mobile + OTP (no password).
- Demo OTP: **`123456`** (any 6-digit code works for the prototype).
- Session persists via AsyncStorage.

## App map (from the UI/UX PDF)

| Area | What’s implemented |
|------|--------------------|
| **Onboarding** | Welcome → phone → OTP (resend countdown) → name → optional birthday/email → terms checkbox |
| **Dock** | Discover · Profile · **Member ID** (raised center) · Vouchers · Account |
| **Discover** | 4:5 promo slideshow, points summary, daily check-in + weekly streak + freezes, member bundles |
| **Profile** | Tier card + progress (T1–T3), points/vouchers, collapsible earn grid, beauty profile checklist |
| **Quizzes** | Skin / Makeup / Hair / Lifestyle (single + multi select), results + tips |
| **Member ID** | Member number + QR placeholder, link to available vouchers |
| **Vouchers** | Available / To redeem / Past tabs, detail + redeem/use flow |
| **Account** | My details, purchases + receipt, privacy, store locator, FAQ search, feedback, logout |

## Project structure

```
src/
  theme/          Brand colors, type, spacing
  types/          Shared TypeScript models
  data/           Mock promos, vouchers, FAQ, quiz questions
  context/        User + voucher state (AsyncStorage)
  components/     Shared UI primitives
  navigation/     Root stack + bottom tabs
  screens/        Onboarding, Discover, Profile, Member ID, Vouchers, Account
```

## Notes

- Tier names are placeholders (`Tier 1/2/3`) per the PDF.
- Backend / real OTP / payments are not wired yet — local mock state only.
- Source of truth for product UX: `startingui.pdf`.
