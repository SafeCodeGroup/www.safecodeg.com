# www.safecodeg.com

The public website of SafeCode Group (branded **SafeCodex** on the site): a single-page marketing
site for the company's enterprise software services and products — custom software, cloud, AI/ML,
ERP integration and cybersecurity — with case studies, the delivery process and a contact /
quote form.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole page: sections, content and layout |
| `css/style.css` | Styles |
| `js/main.js` | Interactivity (navigation, animations, case-study content) |
| `contact.php` | Contact form handler: emails each enquiry to `contact@safecodeg.com` |

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
Before publishing, check that every client name, logo, statistic and case study on the page is
accurate and approved for public use.
