// Layout Rescue checker. It only MEASURES where boxes landed on the page;
// it never reads your CSS. Do not change this file.
(function () {
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var box = function (el) { return el.getBoundingClientRect(); };
  var near = function (a, b, d) { return Math.abs(a - b) <= (d || 4); };
  var sameRow = function (els) { var t = box(els[0]).top; return els.every(function (e) { return near(box(e).top, t, 6); }); };
  var distinct = function (xs) { var out = []; xs.forEach(function (x) { if (!out.some(function (o) { return near(o, x); })) out.push(x); }); return out.length; };

  var checks = [
    ["1 Nav", function () {
      var nav = box($(".nav")), logo = box($(".logo")), links = box($(".links")), li = $$(".links li");
      return sameRow(li) && near(logo.left, nav.left + 32, 8) && near(links.right, nav.right - 32, 8)
        && near(logo.top + logo.height / 2, links.top + links.height / 2, 6);
    }, "Logo left, 4 links in a row on the right, centered up and down."],
    ["2 Hero", function () {
      var h = box($(".hero")), kids = $$(".hero > *").map(box);
      var top = kids[0].top - h.top, bottom = h.bottom - kids[kids.length - 1].bottom;
      return kids.every(function (k) { return near(k.left + k.width / 2, h.left + h.width / 2, 6); })
        && near(top, bottom, 30) && kids[1].top > kids[0].top && kids[2].top > kids[1].top;
    }, "Stacked in a column, in the middle both ways."],
    ["3 Features", function () {
      var c = $$(".card"), w = c.map(function (e) { return box(e).width; });
      return sameRow(c) && near(w[0], w[1], 2) && near(w[1], w[2], 2) && near(box(c[1]).left - box(c[0]).right, 24, 2);
    }, "3 cards in a row, equal widths, 24px apart."],
    ["4 Gallery", function () {
      var p = $$(".photo").map(box);
      return distinct(p.map(function (b) { return b.left; })) === 3 && distinct(p.map(function (b) { return b.top; })) === 2
        && near(p[1].left - p[0].right, 16, 2) && near(p[3].top - p[0].bottom, 16, 2);
    }, "3 columns, 2 rows, 16px gaps."],
    ["5 Bento", function () {
      var t = $$(".tile").map(box), big = t[0], small = t[1];
      return near(big.width, small.width * 2 + 16, 3) && near(big.height, small.height * 2 + 16, 3)
        && near(t[1].top, big.top) && near(t[4].bottom, big.bottom, 3);
    }, "Big tile 2 columns wide and 2 rows tall; 4 small tiles fill the rest."],
    ["6 Footer", function () {
      var f = box($(".footer")), c = $$(".col");
      if (window.innerWidth < 700) return true; // wrapping is fine on a narrow window
      return sameRow(c) && near(box(c[0]).left, f.left + 32, 8) && near(box(c[2]).right, f.right - 32, 8);
    }, "3 columns: first at the left edge, last at the right edge."]
  ];

  var panel = document.createElement("aside");
  panel.setAttribute("aria-live", "polite");
  panel.style.cssText = "position:fixed;right:12px;bottom:12px;background:#fff;color:#1f2933;border:2px solid #1f2933;border-radius:10px;padding:10px 14px;font:14px/1.6 system-ui,sans-serif;z-index:999;max-width:320px;box-shadow:0 4px 12px rgba(0,0,0,.2)";
  document.body.appendChild(panel);

  function run() {
    var done = 0, rows = checks.map(function (c) {
      var ok = false;
      try { ok = c[1](); } catch (e) { ok = false; }
      if (ok) done++;
      return "<div title=\"" + c[2] + "\">" + (ok ? "<b style=\"color:#0b6e4f\">&#10003;</b> " : "<b style=\"color:#b42318\">&#10007;</b> ") + c[0] + "</div>";
    });
    panel.innerHTML = "<strong>Layout check " + done + "/6</strong>" + rows.join("");
  }
  window.addEventListener("load", run);
  window.addEventListener("resize", run);
})();
