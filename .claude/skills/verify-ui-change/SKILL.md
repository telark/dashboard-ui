---
name: verify-ui-change
description: Use before reporting any dashboard-ui change as done, or when type-check, lint or the build fails. Runs the repo's checks and covers what they miss.
---

# Verify a UI change

Goal: the change passes the same gate the telark build pipeline runs on this repo, and anything the checks can't see is either verified another way or named as still open.

## Commands

```sh
npm run check-all            # tsc --noEmit, then eslint .
npm run check-all-and-build  # the above, then generate:licenses and vite build (the pipeline gate)
```

Run `check-all` after every change set and `check-all-and-build` before handing off. The bar is zero errors.

## Fixing failures

- Fix the code, not the rule: no `eslint-disable` comments, no `--no-eslintrc`, `--config` or `--rule` flags, and no edits to `eslint.config.mjs` that relax a rule (for example `no-console`). The checked-in config is what CI runs; when output is unclear, read the config.
- Prettier findings are auto-fixable warnings. Fix them in the files you touched with `npx eslint --fix <those files>`. `npm run lint:f` and `npm run format` rewrite the whole repo, which breaks the surgical-change rule. If one edited line makes prettier want a whole block reflowed (a `memo(({ … }) =>` signature pushed past `printWidth` 100 re-indents the entire component), shorten that line instead of accepting hundreds of whitespace-only hunks.
- `@typescript-eslint/no-explicit-any` is only a warning, so a new `any` passes `check-all`. Check your diff for `any` and give it a real type (AGENTS.md → Types lists the known ones).

## Build side effects

The build scripts regenerate the tracked `public/licenses.json` from the installed runtime dependencies, so expect it in the diff only when dependencies changed. `dist/` is build output and is git-ignored.

## What the checks don't cover

- Rendering, colors, sizes and layout: follow the `visual-and-layout-changes` skill and ask the user for a screenshot of the result.
- Behavior against real data needs the backend services running (README → Local development setup). Don't start `npm run dev` or open a browser unless the user asks, because `dev` opens Chrome (`--open`) and takes over their screen. Ask the user to exercise the change, or say what remains unverified.
- Docs: if the change alters something `README.md` states (scripts, main areas, services, ports, conventions), update it in the same change.

## Report

Say which commands ran and their result, and list anything still unverified, such as visual checks waiting on a screenshot.
