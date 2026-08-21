# Architecture

DeveloperHub is intentionally a static React application. The operator shell loads a typed catalog of tools, then renders an isolated local engine for the selected tool. Browser APIs such as `crypto.subtle`, `crypto.randomUUID`, `TextEncoder`, `Blob`, and the clipboard API perform routine work without a service-side request.

```text
Tool registry → searchable workbench → local engine → output / copy / export
                      ↓
            favorites + recent IDs in localStorage
```

Only tool identifiers and favorite choices are retained in browser local storage. Tool input and output are not persisted by this release. Any future integration that changes this boundary must add a separate service contract, privacy notice, security review, retention policy, and user control.

## Commercial boundary

The GitHub Pages version is a genuine local-first product, not a simulated SaaS. Features requiring persistent identity, team collaboration, billing, private cloud storage, server-side PDF processing, usage telemetry, or background work belong to an optional external application layer. Keep implementation, marketing, and documentation aligned with that boundary.
