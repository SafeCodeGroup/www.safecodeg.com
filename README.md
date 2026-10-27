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

No build step and no dependencies: it is plain HTML, CSS and JavaScript, plus one PHP file for
the contact form.

## Preview locally

```bash
python3 -m http.server 8080      # then open http://localhost:8080
```

That server cannot run PHP, so the contact form shows its error message locally. To test
sending, use `php -S localhost:8080` (needs PHP), or test on the live host.

## Publish

The domain's DNS and web hosting are at HostGator (`safecodeg.com` → HostGator server). Upload the
four paths above to the site's web root (for example with cPanel File Manager or FTP).
`contact.php` sends with PHP `mail()` through the account's mail server, so no mailbox password
is stored in the repo. After publishing, send one test enquiry and confirm it arrives in the
`contact@safecodeg.com` inbox (check spam too).
Product descriptions and stage labels come from each product repository's README; update the
stage labels in `index.html` as products ship.
