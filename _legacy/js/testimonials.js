(async function () {
  const track = document.querySelector(".testimonials-track");
  if (!track) return;

  // Load data
  let data = [];
  try {
    const res = await fetch("assets/testimonials.json?v=1.0", { cache: "no-store" });
    data = await res.json();
  } catch (e) {
    console.error("Failed to load testimonials.json", e);
  }

  if (!Array.isArray(data) || data.length === 0) return;

  // Card builder
  const cardHTML = (t) => {
    const avatar = t.avatar ? `<img class="t-avatar" src="${t.avatar}" alt="${t.name}">` : `<div class="t-avatar placeholder" aria-hidden="true"></div>`;
    
    // Build three separate meta lines
    const metaLines = [
      t.worked_with_at ? `<div class="t-meta-line">${t.worked_with_at}</div>` : "",
      t.worked_with_period ? `<div class="t-meta-line">${t.worked_with_period}</div>` : "",
      t.relationship ? `<div class="t-meta-line">${t.relationship}</div>` : ""
    ].filter(Boolean).join("");

    const companyLine = t.company ? `<div class="t-company">${t.company}</div>` : "";

    const linkedName = t.linkedin_url
      ? `<a href="${t.linkedin_url}" target="_blank" rel="noopener noreferrer" class="t-name">${t.name}</a>`
      : `<span class="t-name">${t.name}</span>`;

    // Preserve original line breaks
    const quoteHTML = (t.quote || "").replace(/\n/g, "<br>");

    return `
      <article class="t-card">
        <div class="t-header">
          ${avatar}
          <div class="t-id">
            ${linkedName}
            <div class="t-role">${t.role || ""}</div>
            ${companyLine}
          </div>
        </div>
        <blockquote class="t-quote">"${quoteHTML}"</blockquote>
        <div class="t-meta">${metaLines}</div>
      </article>
    `;
  };

  // Populate DOM (duplicate once for smooth infinite scroll)
  const cards = data.map(cardHTML).join("");
  track.innerHTML = cards + cards;

  // Basic auto-scroll marquee using requestAnimationFrame
  let pos = 0;
  const speed = 0.5; // px per frame
  function animate() {
    pos += speed;
    if (pos >= track.scrollWidth / 2) pos = 0;
    track.style.transform = `translateX(${-pos}px)`;
    requestAnimationFrame(animate);
  }
  animate();
})();
