# DeveloperHub

> **A privacy-first, browser-native workbench for dependable developer utilities.**

DeveloperHub groups practical tools—formatters, decoders, generators, converters, and web utilities—inside one focused interface. The flagship release implements a modular tool registry, search, category browsing, favorites, recent-tool history, dark and light modes, local-first status messaging, copy/export controls, and several complete client-side engines.

## Current release scope

| Area | Included now | Extension path |
| --- | --- | --- |
| Product shell | Responsive command rail, search, categories, favorites, history, keyboard focus, dark/light modes | Add route-level tools without changing the navigation contract |
| Working tools | JSON, Base64, URL, JWT payload reading, SHA-256, UUIDs, passwords, timestamps, regex, colors, Lorem text, basic HTML formatting | Add one local engine per registered tool ID |
| Privacy model | Local browser processing, explicit status labels, no account requirement | Document any future external integration before it is enabled |
| Delivery | CI, unit test, GitHub Pages workflow, release artifact workflow, CodeQL, Dependabot | Enable repository Pages source and release tags in GitHub |

## Run locally

```bash
pnpm install
pnpm dev
```

Run verification before opening a pull request:

```bash
pnpm check
pnpm test
pnpm exec vite build --base=./
```

## Deploy to GitHub Pages

The repository includes the GitHub Actions Pages deployment pattern. In the repository settings, select **GitHub Actions** as the Pages source; pushes to `main` then build and publish the static application. GitHub documents the custom-workflow route for Pages deployments in its official guide.[1]

The deployment is intentionally static. GitHub Pages can host the browser client but it does **not** provide a production database, traditional user authentication, payment processing, or a general-purpose always-on backend. Those capabilities remain optional integrations and must be designed separately.

## Tool architecture

The shared registry at `client/src/tools/registry.ts` is the single source of truth for categories, labels, descriptive copy, privacy status, search keywords, and readiness. A new client-side tool should add a `ToolDefinition`, implement an isolated branch or component in the workspace, preserve the local-processing message, and add focused verification.

```text
client/src/
├── pages/Home.tsx            # Operator shell and implemented tool engines
├── tools/registry.ts         # Searchable catalog and tool contract
├── contexts/ThemeContext.tsx # Persistent color-mode behavior
└── index.css                 # Signal Desk visual system
```

## Commercial readiness

DeveloperHub is structured for a future free/premium split without faking capabilities. The visible local tools remain useful as a free browser product. Optional commercial additions—account sync, team history, payments, usage analytics, cloud processing, and customer support workflows—need a real third-party service or application backend. Keep the distinction visible in product copy and architecture.

| Repository capability | Included | Owner action |
| --- | --- | --- |
| Versioning and release artifact | Yes | Run **Create Release** with a semantic version |
| Customer-facing docs | Yes | Expand `docs/` with tool-specific guides as tools mature |
| Contribution and security policy | Yes | Review maintainers and contact path before public launch |
| License | MIT | Replace only after a legal review if a proprietary model is preferred |
| Payment, subscriptions, customer accounts | No | Add a suitable external commerce/authentication integration |

## Maintainer documents

Read [Contributing](CONTRIBUTING.md), [Security](SECURITY.md), [Changelog](CHANGELOG.md), and the [architecture notes](docs/architecture.md) before extending the product. GitHub supports repository templates, issue forms, pull-request templates, releases, automated workflows, and dependency updates; this repository carries the core configuration needed to operate along those lines.[2] [3]

## License

MIT. See [LICENSE](LICENSE).

## References

[1] [Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

[2] [Creating a template repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository)

[3] [Configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository)
