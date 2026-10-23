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

No build step and no dependencies: it is plain HTML, CSS and JavaScript.

## Preview locally

```bash
python3 -m http.server 8080      # then open http://localhost:8080
```

## Publish

The domain's DNS and web hosting are at HostGator (`safecodeg.com` → HostGator server). Upload the
three paths above to the site's web root (for example with cPanel File Manager or FTP).
Before publishing, check that every client name, logo, statistic and case study on the page is
accurate and approved for public use.
