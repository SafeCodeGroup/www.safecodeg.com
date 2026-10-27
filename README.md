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
| `.htaccess` | Apache settings for `public_html`: HTTPS + `www` redirect, security headers, caching |
| `.cpanel.yml` | cPanel Git deployment: which files to copy into `public_html` |

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

## Branches

| Branch | Use |
|---|---|
| `Sri-development` | Day-to-day work |
| `master` | Reviewed code (default branch) |
| `production` | What is deployed to www.safecodeg.com |

Changes flow `Sri-development` → `master` → `production` through pull requests.

## Deploy to HostGator (cPanel Git Version Control)

The domain's DNS, hosting and email are at HostGator. cPanel clones this repository and copies
the website files into `public_html` using [`.cpanel.yml`](.cpanel.yml):

| Deployed to `public_html` | Purpose |
|---|---|
| `index.html`, `css/style.css`, `js/main.js` | The website |
| `contact.php` | Contact form email handler |
| `.htaccess` | HTTPS + `www` redirect, security headers, caching |

Nothing else (README, tests, `package.json`, `.git`) is copied to the web root.

### 1. Check HTTPS (SSL)

cPanel → **SSL/TLS Status**: both `safecodeg.com` and `www.safecodeg.com` must show a valid
certificate (AutoSSL issues it for free). [`.htaccess`](.htaccess) then sends every visitor to
`https://www.safecodeg.com`. Its redirect rules only match `safecodeg.com` hosts, so other domains
on the same account are not affected, and `/.well-known/` stays reachable so AutoSSL can renew.

### 2. Clone the repository in cPanel

cPanel → **Git™ Version Control** → **Create** → turn on **Clone a Repository**.
(If your cPanel has no Git™ Version Control icon, use the manual upload below.)

This repository is **private**, so cPanel needs credentials to clone it. Choose one:

- **HTTPS with a read-only token**
  1. GitHub → Settings → Developer settings → **Fine-grained personal access tokens** →
     Generate new token. Resource owner: **SafeCodeGroup**; Repository access: **Only select
     repositories → www.safecodeg.com**; Permissions: **Contents → Read-only**. (An organization
     owner may need to approve the token.)
  2. Clone URL: `https://x-access-token:YOUR_TOKEN@github.com/SafeCodeGroup/www.safecodeg.com.git`
  3. The token is saved on the server in the clone's git config. It is read-only and limited to
     this repository; revoke it on GitHub any time to cut off access.
- **SSH deploy key** (no token stored in a URL)
  1. cPanel → **SSH Access** → Manage SSH Keys → Generate a new key (no passphrase), then view
     the **public** key.
  2. GitHub → repository → Settings → **Deploy keys** → Add deploy key → paste it, leave
     "Allow write access" **off**.
  3. Clone URL: `git@github.com:SafeCodeGroup/www.safecodeg.com.git`
- **Make the repository public**: then the plain HTTPS URL works with no credentials:
  `https://github.com/SafeCodeGroup/www.safecodeg.com.git`. The repository holds no secrets
  (no passwords or keys), but it is a decision for the repository owner.

Set **Repository Path** to `/home2/safecode/repositories/www.safecodeg.com` and **Repository
Name** to `www.safecodeg.com`, then **Create**. Never use `public_html` itself as the repository
path: that creates an empty repository inside the website folder ("No checked-out branch is
available") instead of cloning from GitHub.

If a repository was already created at `/home2/safecode/public_html`: cPanel → Git™ Version
Control → **Remove** it (this only removes it from the list), then cPanel → File Manager →
`public_html` → Settings → **Show Hidden Files** → delete the `.git` folder there. Deleting that
`.git` folder does not touch the website files. `.htaccess` also blocks any `.git` path from the
web as a safety net.

### 3. Deploy the `production` branch

1. Git™ Version Control → **Manage** → **Basic Information** → **Checked-Out Branch**: choose
   `production` → **Update**.
2. **Pull or Deploy** tab → **Update from Remote** → **Deploy HEAD Commit**.

On the first deploy, any existing `public_html/.htaccess` is saved once, outside the web root,
as `~/htaccess-backups/public_html.htaccess.pre-git`.

Other folders in `public_html` are other sites' document roots, and `.htaccess` applies to them
too. So its redirects, headers and caching are limited to `safecodeg.com` hosts; only the
dotfile protection (404 for `.git`, backups and other dotfiles, except `/.well-known/`) applies
to every site, as the server's previous `.htaccess` did.

The host's bot protection answers the first `contact.php` request from a new visitor with a 409
cookie check; `js/main.js` sets that cookie and retries once, so the form still works.

cPanel only deploys when `.cpanel.yml` is in the repository root (it is) and the server's
clone has no local changes, so never edit files inside `repositories/www.safecodeg.com` on the
server. If deployment fails because `$HOME` is not set, edit `.cpanel.yml` and replace
`$HOME/public_html` with `/home2/safecode/public_html` (this account's home is `/home2/safecode`).

### 4. Check the live site

- `https://www.safecodeg.com` shows the site with a padlock.
- `http://safecodeg.com` redirects to `https://www.safecodeg.com`.
- Send one test message with a normal topic (arrives at `contact@safecodeg.com`) and one with
  **Product support** (arrives at `support@safecodeg.com`, copied to `contact@`). Check spam too.
  `contact.php` sends with PHP `mail()` through the account's own mail server, so no mailbox
  password is stored in the repository.

### Updating the site later

Merge changes into `production` on GitHub, then in cPanel → Git™ Version Control → Manage →
Pull or Deploy → **Update from Remote** → **Deploy HEAD Commit**.

### Manual upload (alternative)

`npm run build`, then upload the contents of `dist/` to `public_html` with cPanel File Manager
(turn on **Show Hidden Files** so `.htaccess` is included).

## Content

Product descriptions and stage labels come from each product repository's README; update the
stage labels in `index.html` as products ship.
