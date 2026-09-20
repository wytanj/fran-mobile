# Figma staged vs ready — fran-app aug26 (`lUTIEfH8vnd6rPLr1IogYx`)

Source: Page 1 metadata + section banners. File has a **WORK IN PROGRESS** banner — treat unnamed iPhone frames under WIP columns as **REVIEW** until design marks them done.

## Legend
- **READY** — shipped or safe to implement/polish now (named flows + TODO.md SoT)
- **STAGED** — empty/pre-login/error/WIP variants; scaffold only or skip
- **REVIEW** — complete-looking frames; implement after quick design confirm (or pair with READY siblings)

## Consumer fran-mobile (Track A)

| Section | Status | Notes / next |
| --- | --- | --- |
| Login / OTP | **READY** | `40:3176`, `40:2418`+filled — in app |
| Member ID / Scan | **READY** | `1:4296` — in app; variants `48:1494/1865` REVIEW |
| You (profile) | **READY** core | `1:4354` — in app; guest `1:4635` |
| Rewards main | **READY** | `45:1088` / guest `45:3797` — in app |
| Skin / Makeup / Hair / Lifestyle quizzes | **REVIEW → build** | Full phone sets under quiz sections — **A0 priority** (wired but Figma variants not restyled) |
| Rewards tier detail | **REVIEW → build** | Tier screens in Rewards row (`45:3439` etc.) — **A0 priority** |
| Discover / BAU / check-in / streak | **REVIEW** | Daily check-in, streak freeze, bonus day — next after A0 |
| Account / My details / FAQ / Purchase history | **MIXED** | Filled+edit READY-ish; empty/error **STAGED** |
| Store locator / Feedback / Notifications | **REVIEW** | Implement after Account polish |
| Pre-login / new user banners | **STAGED** | Pre-login view, empty states |
| Delete account toasts | **STAGED/edge** | Low priority |

## Staff OT (Track B)
**Not in this Figma.** Draft UX from fran-hrm T&A; no staged/ready frames here.

## Build order
1. A0 READY polish + quiz/tier REVIEW frames → git draft PR on `fran-mobile`
2. B0 staff OT draft app (`fran-staff` or new Expo) → Hours / day / estimate → git draft PR
3. Discover streak/check-in REVIEW after A0
4. Skip STAGED until design graduates them
