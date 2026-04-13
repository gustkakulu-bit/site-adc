/* ============================================================
   shared.js — Scripts communs à toutes les pages ADC
   ============================================================ */

// Loader
window.addEventListener("load", function () {
  const loader = document.getElementById("loader");
  if (!loader) return;
  if (sessionStorage.getItem("loaded")) { loader.style.display = "none"; return; }
  sessionStorage.setItem("loaded", "true");
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => { loader.style.display = "none"; }, 500);
  }, 400);
});

// Menu hamburger
(function () {
  const toggle = document.querySelector(".menu-toggle");
  const nav    = document.querySelector("nav");
  if (!toggle || !nav) return;
  toggle.addEventListener("click", () => nav.classList.toggle("active"));
  toggle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") nav.classList.toggle("active");
  });
})();

// Dropdown
(function () {
  const toggleBtn = document.querySelector(".dropdown-toggle");
  const menu      = document.querySelector(".dropdown-menu");
  if (!toggleBtn || !menu) return;
  toggleBtn.addEventListener("click", (e) => { e.preventDefault(); menu.classList.toggle("show"); });
  document.addEventListener("click", (e) => { if (!e.target.closest(".dropdown")) menu.classList.remove("show"); });
})();

// Fade-in au scroll
(function () {
  const elements = document.querySelectorAll(".fade-in");
  if (!elements.length) return;
  function check() {
    const vh = window.innerHeight;
    elements.forEach((el) => { if (el.getBoundingClientRect().top < vh - 60) el.classList.add("visible"); });
  }
  check();
  window.addEventListener("scroll", check, { passive: true });
})();
