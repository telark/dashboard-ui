# Contributing to dashboard-ui

Thanks for helping. dashboard-ui is the web dashboard of [Telark](https://github.com/telark/telark); the backend services, Helm chart and product docs live in that repository. Read the [Telark contributing guide](https://github.com/telark/telark/blob/main/CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Before you start

- Open or pick an issue for anything bigger than a small fix, so the approach is agreed before you write code.
- Security issues go through the private channel in [SECURITY.md](SECURITY.md), never a public issue.

## Development

Node.js 26 and npm (the image build uses `node:26`).

```sh
npm ci
npm run dev          # http://localhost:3000, needs the Telark services reachable
npm run check-all    # type-check + lint
npm run build
```

Rules for code structure, constants and styling are in [AGENTS.md](AGENTS.md). Reuse existing components and colour tokens instead of adding new ones.

## Pull requests

- Branch from `main` and target `main`.
- Keep the change scoped: every changed line traces to the goal of the PR.
- `npm run check-all` and `npm run build` pass.
- Commit messages follow [Conventional Commits](https://www.conventionalcommits.org/).
- Include before/after screenshots for visible UI changes.

By contributing you agree that your contribution is licensed under the [Elastic License 2.0](LICENSE.md).
