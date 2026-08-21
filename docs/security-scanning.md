# Code scanning availability

The CodeQL workflow has been disabled from automatic execution for this private repository because GitHub rejected result uploads with: “Code scanning is not enabled for this repository.” The application code, unit tests, dependency monitoring, and CI workflow remain active.

GitHub’s current guidance states that CodeQL code scanning for private repositories requires an eligible GitHub Team or Enterprise plan with GitHub Code Security enabled. Do not re-enable `.github/workflows/codeql.yml.disabled` until the repository is eligible and code scanning is enabled in **Settings → Code security**. After that setting is enabled, rename the file back to `codeql.yml`; the workflow already uses CodeQL v4 and the required `actions: read`, `contents: read`, and `security-events: write` permissions.

Reference: [Troubleshooting CodeQL analysis errors for private repositories](https://docs.github.com/en/code-security/reference/code-scanning/troubleshoot-analysis-errors/private-repository-enablement).
