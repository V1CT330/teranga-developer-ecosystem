# Deployment guide

## GitHub Pages

1. A repository owner first opens **Settings → Pages** and chooses **GitHub Actions** as the source. This owner-level setting cannot be enabled by the workflow token used in this repository.
2. Open the **Actions** tab, select **Deploy GitHub Pages**, and run it manually after the Pages source is enabled.
3. The workflow builds the Vite app with the repository base path and publishes `dist/public`.
4. Open the deployment environment URL after the workflow completes.

The workflow uses GitHub’s standard Pages artifact and deployment actions. See GitHub’s [custom workflow guide](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) for the current platform behavior.

## Release artifact

Use the **Create Release** workflow, enter a semantic version without the `v` prefix, and let the workflow attach the static build archive plus generated notes. The release does not publish an NPM package or make external payment/account changes.
