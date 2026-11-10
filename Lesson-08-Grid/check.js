// check.js · Grid Arena · DON'T EDIT THIS FILE
// For every level it measures each box in TARGET and in YOURS (position and size,
// measured from the corner of its court). If every box matches within 2px, the level is cleared.
// Levels with data-widths are measured at EACH width listed, so a layout must really be responsive.

function boxesIn(court) {
  const origin = court.getBoundingClientRect();
  return [...court.querySelectorAll("[data-k]")].map(el => {
    const r = el.getBoundingClientRect();
    return [r.left - origin.left, r.top - origin.top, r.width, r.height];
  });
}

function sameBoxes(a, b) {
  return a.length === b.length && a.every((box, i) => box.every((n, j) => Math.abs(n - b[i][j]) <= 2));
}

function checkLevel(level) {
  const target = level.querySelector(".court.target");
  const yours = level.querySelector(".court.yours");
  const widths = (level.dataset.widths || "").split(" ").filter(Boolean).map(Number);
  const inners = [target.firstElementChild, yours.firstElementChild];
  if (widths.length === 0) return { wide: sameBoxes(boxesIn(target), boxesIn(yours)), narrow: true };
  const results = widths.map(w => {
    inners.forEach(el => { el.style.width = w + "px"; });
    return sameBoxes(boxesIn(target), boxesIn(yours));
  });
  inners.forEach(el => { el.style.width = ""; });   // back to what the page shows
  return { wide: results[0], narrow: results.slice(1).every(Boolean) };
}

function checkAll() {
  let cleared = 0, bonus = false;
  document.querySelectorAll(".level").forEach(level => {
    const { wide, narrow } = checkLevel(level);
    // No level needs a margin: space between grid items is gap's job.
    const usedMargin = [...level.querySelectorAll(".court.yours [data-k]")].some(el => {
      const s = getComputedStyle(el);
      return [s.marginTop, s.marginRight, s.marginBottom, s.marginLeft].some(m => m !== "0px");
    });
    const ok = wide && narrow && !usedMargin;
    let message = "Not yet";
    if (ok) message = "✓ Cleared";
    else if (wide && narrow && usedMargin) message = "Close! No margins: use gap";
    else if (wide && !narrow) message = "Right wide, wrong narrow: make it responsive";
    level.classList.toggle("cleared", ok);
    level.querySelector(".status").textContent = message;
    if (ok && level.classList.contains("bonus")) bonus = true;
    else if (ok) cleared++;
  });
  document.getElementById("cleared").textContent = cleared;
  document.getElementById("bonus").textContent = bonus ? " + BONUS ★" : "";
}

// "Show narrow" buttons: draw both courts at the narrow width so you can see the second check.
document.querySelectorAll(".narrow-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const level = btn.closest(".level");
    const on = level.classList.toggle("narrow");
    btn.setAttribute("aria-pressed", on);
    btn.textContent = on ? "Show wide" : "Show narrow";
  });
});

// Check once the page has loaded, and again if the window is resized.
window.addEventListener("load", checkAll);
window.addEventListener("resize", checkAll);
