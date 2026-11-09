// check.js · Flexbox Arena · DON'T EDIT THIS FILE
// For every level it measures each box in TARGET and in YOURS (position and size,
// measured from the corner of its court). If every box matches within 2px, the level is cleared.

function boxesIn(court) {
  const origin = court.getBoundingClientRect();
  return [...court.querySelectorAll("[data-k]")].map(el => {
    const r = el.getBoundingClientRect();
    return [r.left - origin.left, r.top - origin.top, r.width, r.height];
  });
}

function checkAll() {
  let cleared = 0, bonus = false;
  document.querySelectorAll(".level").forEach(level => {
    const target = boxesIn(level.querySelector(".court.target"));
    const yours = boxesIn(level.querySelector(".court.yours"));
    const matches = target.length === yours.length &&
      target.every((box, i) => box.every((n, j) => Math.abs(n - yours[i][j]) <= 2));
    // No level needs a margin: space between flex items is gap's job.
    const usedMargin = [...level.querySelectorAll(".court.yours [data-k]")].some(el => {
      const s = getComputedStyle(el);
      return [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft].some(m => m !== "0px");
    });
    const ok = matches && !usedMargin;
    level.classList.toggle("cleared", ok);
    level.querySelector(".status").textContent =
      ok ? "✓ Cleared" : (matches && usedMargin ? "Close! No margins: use gap" : "Not yet");
    if (ok && level.classList.contains("bonus")) bonus = true;
    else if (ok) cleared++;
  });
  document.getElementById("cleared").textContent = cleared;
  document.getElementById("bonus").textContent = bonus ? " + BONUS ★" : "";
}

// Check once the page (and its fonts) have loaded, and again if the window is resized.
window.addEventListener("load", checkAll);
window.addEventListener("resize", checkAll);
