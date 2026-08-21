# Contributing to DeveloperHub

DeveloperHub values practical developer workflows, visible privacy boundaries, and small changes that can be verified locally. Before starting work, check the open issues and describe the intended behavior in terms a user can test.

## Development standard

Keep every browser-native operation explicit about whether data remains local. Do not add network requests, analytics, tracking, remote code execution, secret handling, or unreviewed third-party assets inside a tool without documenting and reviewing the change first.

Run `pnpm check`, `pnpm test`, and `pnpm exec vite build --base=./` before submitting a pull request. Use the pull-request template and state whether the change alters data handling, local storage, exports, or supported browser APIs.

## Adding a tool

Add the tool definition in `client/src/tools/registry.ts`, add a discoverable name and keywords, implement a clear local engine or mark the feature as planned, and add a test covering any reusable contract. Preserve keyboard access, contrast, and the Signal Desk information hierarchy.
