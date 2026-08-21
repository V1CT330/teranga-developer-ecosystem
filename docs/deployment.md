# Deployment guide

## GitHub Pages

1. Push the repository’s `main` branch to GitHub.
2. Open **Settings → Pages** and choose **GitHub Actions** as the source.
3. Review the **Deploy GitHub Pages** workflow. It builds the Vite app with the repository base path and publishes `dist/public`.
4. Open the deployment environment URL after the workflow completes.

The workflow uses GitHub’s standard Pages artifact and deployment actions. See GitHub’s [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for the current platform behavior.

## Release artifact

Use the **Create Release** workflow, enter a semantic version without the `v` prefix, and let the workflow attach the static build archive plus generated notes. The release does not publish an NPM package or make external payment/account changes.
