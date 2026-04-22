const hamburger = document.getElementById("hamburger");
const mobileMenu = document.getElementById("mobileMenu");

// Toggle menu
hamburger.addEventListener("click", (e) => {
  e.stopPropagation();
  mobileMenu.classList.toggle("active");
});

// Close outside click
document.addEventListener("click", (e) => {
  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
    mobileMenu.classList.remove("active");
  }
});

// Close on link click
document.querySelectorAll(".mobile-menu a").forEach(link => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("active");
  });
});