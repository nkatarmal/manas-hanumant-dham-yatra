# Manas Hanumant Dham Yatra

A static, bilingual (English/Gujarati) GitHub Pages directory for Saturday buses, tempo travellers and other group transport services travelling to Manas Hanumant Dham, Nava Katariya.

## Files

- `index.html` — page structure and content
- `styles.css` — design and responsive layout
- `app.js` — filtering and language switching
- `operators.json` — **the only data file you need to edit** to add/update operators
- `assets/` — illustration and favicon

## Run locally

Do not open `index.html` directly with `file://`, because the browser will block the JSON request. From the project folder run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

## Publish on GitHub Pages

1. Create a new GitHub repository, for example `manas-hanumant-dham-yatra`.
2. Upload the files while preserving the folder structure.
3. In GitHub, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Select `main` and `/ (root)` and save.
6. Your site will appear at the GitHub Pages URL shown by GitHub.

## Updating operators

Only edit `operators.json` for normal directory changes. The current data model is intentionally small:

- `name` — operator/service name
- `sourceCity` / `sourceCityGu` — departure city
- `vehicle` / `vehicleGu` — vehicle type
- `scheduleEn` / `scheduleGu` — schedule
- `departureEn` / `departureGu` — route
- `fareAmount` — numeric fare/rent amount without the `₹` symbol
- `contact` — booking phone number(s)
- `socialUrl` / `socialType` — optional public social link for the operator/service

The site displays the fare simply as `₹<amount>`. It does not display research notes, source/evidence labels or verification notes.

## Contact for adding a listing

The site asks operators and devotees to contact **Nirav Katarmal** by call or WhatsApp at **8511842261** to submit new or updated transport details.

## Design note

The palette and devotional feel take inspiration from the warm saffron, maroon, cream and gold tones visible on the Manas Hanumant Dham public website. The hero uses the Hanuman idol photograph supplied for this project in `assets/hanuman-idol.jpg`. It is displayed without animation or visual transformation; only responsive sizing is applied.


### Hero image
The hero uses `assets/hanuman-idol.jpg`, the photograph supplied for this project. The photograph itself is kept unchanged and is only resized responsively by CSS. No animation is applied.
