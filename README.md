# Gyld Design Assessment Foundation

This repo is a lightweight frontend-only foundation for the Gyld design engineer assessment.

It intentionally includes:

- a single control panel page
- mocked local data only
- no backend API calls
- no auth, database, or environment setup
- local interactions for the highest-priority actions:
  - `Start Event`
  - `Give Points`
  - `Take Points`

The goal is to make the assessment fast to spin up so candidates can focus on the product and UX problem rather than infrastructure.

It is also intentionally structured to surface implementation decisions:

- the control panel is split into small components instead of a single large file
- local fixture states are available to test different control-panel conditions
- lint rules enforce source-file size limits and basic implementation hygiene

## Run locally

Requirements:

- Node.js 20+ recommended
- `pnpm`

Install dependencies:

```bash
pnpm install
```

Start the dev server:

```bash
pnpm dev
```

Then open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

## Available scripts

```bash
pnpm dev
pnpm build
pnpm preview
pnpm lint
pnpm test
```

## Project shape

- `src/App.tsx`
  - top-level composition and modal routing
- `src/hooks/useControlPanelState.ts`
  - local state transitions for the assessment
- `src/mockData.ts`
  - mock guild, section, event, and member data
- `src/fixtures.ts`
  - internal local fixture states for the control panel
- `src/components/`
  - section panel, pause banner, and modals
- `src/App.css`
  - shared page and modal styles
- `src/index.css`
  - global styles

## Working contract

- keep this as a single control-panel surface rather than turning it into a multi-page app
- keep the four section categories recognizable:
  - `Events`
  - `Rewards & Punishments`
  - `Membership`
  - `Game Management`
- no backend or real API wiring is expected for this assessment
- the primary mocked interaction flows are:
  - `Start Event`
  - `Give Points`
  - `Take Points`
- other actions may be expanded if useful, but they do not need full backend-realistic implementations

## Lint constraints

The repo includes explicit lint rules intended to be visible to both humans and AI coding agents:

- source files must stay under `300` lines
- `console.log` style debugging is disallowed by lint
- adding new dependencies should be rare and should have a clear justification
- keep `pnpm build`, `pnpm lint`, and `pnpm test` passing

Run:

```bash
pnpm lint
pnpm test
```

The tests are lightweight behavioral guardrails for a few mocked interactions. Passing them is expected, but it is not a substitute for good product judgment, interaction quality, or implementation quality.

## Notes

- The page is intentionally a simplified mock of Gyld's existing creator control panel.
- Most actions outside the 3 priority flows use lightweight local mock behavior.
- The app opens in the default fixture state. Additional fixture presets remain available in code for internal review and QA.
- Some mock data is intentionally awkward or imperfect to reflect real UI constraints.
- Candidates should be able to change structure, interaction patterns, styling, and local state behavior freely as part of the assessment.
