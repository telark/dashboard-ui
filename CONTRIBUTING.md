# Contributing to dashboard-ui

Thanks for helping. dashboard-ui is the web dashboard of [Telark](https://github.com/telark/telark). This repository holds the dashboard SPA only: the backend services, Helm chart, CRDs and product docs live in the Telark repository. Read the [Telark contributing guide](https://github.com/telark/telark/blob/main/CONTRIBUTING.md) and the [Code of Conduct](CODE_OF_CONDUCT.md) first.

## Before you start

- Open or pick an issue for anything bigger than a small fix, so the approach is agreed before you write code.
- Security issues go through the private channel in [SECURITY.md](SECURITY.md), never a public issue.

## Development

Setup, ports and scripts are in the [README](README.md#develop). Rules for code structure, constants and styling are in [AGENTS.md](AGENTS.md). Reuse existing components and color tokens instead of adding new ones.

## Pull requests

Branch names, commit messages and pull requests follow the [Telark contribution guide](https://github.com/telark/telark/blob/main/CONTRIBUTING.md#branches-commits-and-pull-requests). For this repository:

- `npm run check-all-and-build` passes (it runs `check-all` first). The Telark [`build-ui.yaml`](https://github.com/telark/telark/blob/main/.github/workflows/build-ui.yaml) workflow runs the same checks when it builds the image.
- Include before/after screenshots for visible UI changes.

By contributing you agree that your contribution is licensed under the [Elastic License 2.0](LICENSE.md).
