# Project landing pages

Each hobby project has a dedicated landing page with:

- **Problem / solution** – What pain it solves and how
- **Features** – What it does (practical, useful)
- **Tech stack** – Technologies used
- **Next steps** – Roadmap and ideas
- **Links** – GitHub and demo (you add the demo URL)

## Adding demo links

In each `*.html` file, replace the placeholder:

- `href="#"` on the “Live demo” / “Demo” button with your real demo URL (e.g. Railway, Render, or GitHub Pages).

## Password-protecting a page

To make a project page accessible only with a password:

1. **Uncomment the password gate block** in that project’s HTML (the `id="pwd-gate"` div and its form).
2. **Uncomment the script** at the bottom: `<script src="../../js/project-pwd-gate.js"></script>`.
3. **On `<body>`:** Add `data-pwd-protected="true"`. Remove the class `unlocked` from the `id="project-content-gated"` div so the content is hidden until the user enters the password.
4. **Set the password** on `<body>` (choose one):
   - **Option A – Plain password (simplest):**  
     `data-pwd-protected="true"` and `data-pwd-value="yourSecret"`  
     (Avoid if the repo is public and you don’t want the password in the HTML.)
   - **Option B – SHA-256 hash (no plain password in HTML):**  
     `data-pwd-protected="true"` and `data-pwd-hash="hexHash"`  
     Generate the hash in the browser console:  
     `const enc = new TextEncoder(); crypto.subtle.digest('SHA-256', enc.encode('yourPassword')).then(h => console.log(Array.from(new Uint8Array(h)).map(b => b.toString(16).padStart(2,'0')).join('')))`  
     Copy the hex string into `data-pwd-hash`.
5. **Optional:** set `data-pwd-storage-key="pep-be"` (or another unique key) on `<body>` so the “unlocked” state is per-page.

Unlocking is stored in `sessionStorage` for the current tab; closing the tab requires the password again.
