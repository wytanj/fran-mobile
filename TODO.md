# Handoff — A0 quiz + tier (feat/a0-quiz-tier-figma)

**Figma SoT:** [fran-app (aug26) - wip](https://www.figma.com/design/lUTIEfH8vnd6rPLr1IogYx/fran-app--aug26---wip-?node-id=0-1&m=dev) — fileKey `lUTIEfH8vnd6rPLr1IogYx`, page `0:1`.

Colours/fonts stay `src/theme` (Fran yellow `#FFE14D`, cream, brown, Platform + Symbol). Do not rematch Figma hex.

## A0 in this branch (REVIEW → build)

| Section | Frames | App |
|---|---|---|
| Skin / Makeup / Hair / Lifestyle quizzes | `1:3786+` (skin set), makeup/hair/lifestyle siblings | `QuizScreen` + You cards — earn +15 hint, existing flow |
| Quiz results | `1:4065` etc. | `BeautyResultsScreen` title/copy polish |
| Membership tier detail | `45:3491` / `45:3583` / `45:3684` (Tiers) — TODO historically cited `45:3439` which is points txn sibling | `MembershipTiersScreen` off Rewards |

## READY (already shipped — polish only)

Login/OTP, Member ID, You core, Rewards main.

## SKIP STAGED (scaffold only / not this PR)

- Pre-login / empty my-details / error notification variants
- WIP unnamed iPhone frames under WORK IN PROGRESS banner
- // STAGED: treat as REVIEW until design graduates — do not ship empty/error shells

## LATER (not this PR)

Discover check-in/streak/bonus, Account FAQ/purchase, store locator/feedback/notifications, Android APK / `eas.json`.

## Tabs

Discover · You · Scan · Rewards · Account — matches fran-app footer (`45:1246`).

## Leave untracked

`faqs.csv`, `.cursor/`
