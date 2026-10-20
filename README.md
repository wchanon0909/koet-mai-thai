# เกิดใหม่ในไทย / Koet Mai Thai — Visual Edition v0.3.0

Static GitHub Pages release with **life timeline**, a centered **decision popup**, dashboard on the right, bundled illustrated artwork, school-year events, family/friend/romance, simulated history and future to character death.

## Setup / publish

Clone your repository, extract this package **into the root of the cloned repo** (not inside a second subfolder), then run:

```powershell
git add -A
git commit -m "Visual Edition v0.3.0 - timeline and decision modal"
git push origin main
```

GitHub Repository Settings > Pages > Source: **GitHub Actions**. Workflow is supplied at `.github/workflows/pages.yml`.

## Local testing

```powershell
npm test
npm run build
python -m http.server 8080
```

Visit http://localhost:8080. All bundled assets are stored locally; no API keys are needed.

## Important

- This is a **visual implementation based on the approved concept**, not a pixel-for-pixel duplication of the generative mockup; the original mockup contains visual details not yet represented as components.
- Mortality risks and other simulation probabilities still use **prototype values**, not fully validated province-specific models. Provinces are currently equal-weight random.
- Personal outcomes are simulated; historical events are tied to actual BE years while the future is speculative.
- Illustration artwork is included in `assets/` and does not require separate downloads.
- The popup close button temporarily minimizes the decision; click the floating button to reopen it.
