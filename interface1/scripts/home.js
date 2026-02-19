// scripts/home.js
import { updateCartCountUI } from "../data/cart.js";

function initCarousel() {
  let index = 0;
  const slides = document.querySelector(".slides");
  const totalSlides = document.querySelectorAll(".slides > *").length;

  if (!slides || !totalSlides) return;

  const dotsContainer = document.querySelector(".carousel-dots");
  dotsContainer.innerHTML = "";

  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  }

  const dots = Array.from(dotsContainer.querySelectorAll("span"));

  function updateCarousel() {
    slides.style.transform = `translateX(-${index * 100}%)`;
    dots.forEach((d) => d.classList.remove("active"));
    dots[index].classList.add("active");
  }

  function nextSlide() {
    index = (index + 1) % totalSlides;
    updateCarousel();
  }

  function prevSlide() {
    index = (index - 1 + totalSlides) % totalSlides;
    updateCarousel();
  }

  function goToSlide(i) {
    index = i;
    updateCarousel();
  }

  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  if (nextBtn) nextBtn.addEventListener("click", nextSlide);
  if (prevBtn) prevBtn.addEventListener("click", prevSlide);

  setInterval(nextSlide, 4000);
}

function initCTA() {
  const btn = document.querySelector(".cta-btn");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const section = document.querySelector(".latest-grid");
    if (section) section.scrollIntoView({ behavior: "smooth" });
  });
}

function initSearchForward() {
  const input = document.querySelector(".search-input");
  const btn = document.querySelector(".search-btn");

  if (!input || !btn) return;

  const go = () => {
    const term = input.value.trim();
    if (!term) return;
    window.location.href = `women.html?search=${encodeURIComponent(term)}`;
  };

  btn.addEventListener("click", go);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") go();
  });
}

updateCartCountUI();
initCarousel();
initCTA();
initSearchForward();
