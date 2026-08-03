/**
 * Optional password gate for project landing pages.
 * Usage: Add to the <body> or a wrapper:
 *   - data-pwd-protected="true"
 *   - data-pwd-value="yourSecret"  (plain comparison, or use data-pwd-hash for SHA-256 hex)
 *   - data-pwd-hash="sha256hex"     (optional: use instead of data-pwd-value for hash comparison)
 *   - data-pwd-storage-key="pep-be" (optional: unique key per page for sessionStorage)
 *
 * HTML structure:
 *   <div id="pwd-gate" class="pwd-gate">...</div>
 *   <div id="project-content-gated" class="project-content-gated">...</div>
 */
(function () {
    function getStorageKey() {
        const key = document.body.getAttribute('data-pwd-storage-key');
        return key ? 'project-pwd-' + key : 'project-pwd-' + (window.location.pathname || 'default');
    }

    function isUnlocked() {
        return sessionStorage.getItem(getStorageKey()) === '1';
    }

    function setUnlocked() {
        sessionStorage.setItem(getStorageKey(), '1');
    }

    async function hashPassword(str) {
        const enc = new TextEncoder();
        const data = enc.encode(str);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }

    function init() {
        const protectedAttr = document.body.getAttribute('data-pwd-protected');
        if (protectedAttr !== 'true' && protectedAttr !== '') return;

        const gateEl = document.getElementById('pwd-gate');
        const contentEl = document.getElementById('project-content-gated');
        if (!gateEl || !contentEl) return;

        if (isUnlocked()) {
            gateEl.style.display = 'none';
            contentEl.classList.add('unlocked');
            return;
        }

        contentEl.classList.remove('unlocked');
        gateEl.style.display = 'block';

        const input = gateEl.querySelector('input[type="password"]');
        const submitBtn = gateEl.querySelector('button[type="submit"]');
        const errorEl = gateEl.querySelector('.pwd-error');

        gateEl.addEventListener('submit', async function (e) {
            e.preventDefault();
            if (!input) return;

            const value = document.body.getAttribute('data-pwd-value');
            const expectedHash = document.body.getAttribute('data-pwd-hash');
            const entered = input.value;

            let ok = false;
            if (expectedHash) {
                const enteredHash = await hashPassword(entered);
                ok = enteredHash.toLowerCase() === expectedHash.toLowerCase();
            } else if (value) {
                ok = entered === value;
            }

            if (ok) {
                setUnlocked();
                gateEl.style.display = 'none';
                contentEl.classList.add('unlocked');
                if (errorEl) errorEl.classList.remove('visible');
            } else {
                if (errorEl) {
                    errorEl.textContent = 'Incorrect password. Try again.';
                    errorEl.classList.add('visible');
                }
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
