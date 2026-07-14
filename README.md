# kamil elektra — Portfolio 2026

This is a complete static website: it does not need Node.js, a build step, or a database. All project assets are included under `public/assets`.

## Publish with GitHub Pages

1. Create a new GitHub repository, or open the repository you want to use.
2. Upload the **contents of this folder** to the repository root. `index.html` must be at the repository root, alongside `styles.css` and `script.js`.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select the `main` branch and the `/ (root)` folder, then save.
6. GitHub will provide the live `https://…github.io/…/` URL once deployment finishes.

All local asset links are relative, so the site works at either a custom domain or a standard GitHub Pages project URL.

## Notes

- The custom Aktura font and all supplied images/video are included locally.
- The body font and one cursor-trail CD image load from Framer-hosted URLs, exactly as in the current local version. The site still works if either is unavailable, but the fallback body font or a missing final trail image may be visible.
- GitHub Pages is HTTPS, so the email-copy button uses the normal clipboard API there.
