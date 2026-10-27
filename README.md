# www.safecodeg.com

The public website of Safe Code Group LLC (Rock Springs, Wyoming, USA and Hyderabad, India): a
single-page site presenting the company's 29 products in seven families — identity & licensing,
learning, AI platforms, security & infrastructure, devices & embedded, industry solutions and
research — plus services, how we work, offices and a contact form.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole page: sections, content and the product catalogue |
| `css/style.css` | Styles |
| `js/main.js` | Interactivity (navigation, product filters, contact form, product finder) |
| `contact.php` | Contact form handler: emails enquiries to `contact@safecodeg.com`; "Product support" goes to `support@safecodeg.com` (copied to contact@) |

The site itself is plain HTML, CSS and JavaScript plus one PHP file, with no runtime
dependencies. npm is only used for local development: preview, tests and packaging.

## Development (npm)

Requires Node.js 20 or newer.

```bash
npm install        # installs the dev tools (validators, test runner)
npm start          # preview at http://127.0.0.1:8080 (PORT=3000 npm start to change)
npm test           # HTML/CSS/JS validation + behaviour test of the page
npm run build      # copies the files to upload into dist/
```

The preview server cannot run PHP, so the contact form shows its error message locally; test
sending on the live host.

## Publish

The domain's DNS and web hosting are at HostGator (`safecodeg.com` → HostGator server). Run
`npm run build` and upload the contents of `dist/` (`index.html`, `contact.php`, `css/`, `js/`)
to the site's web root (for example with cPanel File Manager or FTP).
`contact.php` sends with PHP `mail()` through the account's mail server, so no mailbox password
is stored in the repo. After publishing, send one test enquiry and confirm it arrives in the
`contact@safecodeg.com` inbox (check spam too).
Product descriptions and stage labels come from each product repository's README; update the
stage labels in `index.html` as products ship.
