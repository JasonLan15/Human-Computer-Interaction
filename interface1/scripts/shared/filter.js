//  UNIVERSAL FILTER ENGINE (MEN / WOMEN / CHILDREN)
import { generateHTML, attachProductCardEvents } from "./general.js";
import { updateCartCountUI } from "../../data/cart.js";


// FILTER STATE
export let filters = {
  style: null,
  category: null,
  size: null,
  search: null
};


// CATEGORY MATCHING — handles Tshirt, T-Shirt, Tee, Sweatshirt, Hoodie
const CATEGORY_MAP = {
  sweatshirt: ["sweatshirt", "sweatshirts", "sweater", "hoodie", "crewneck"],
  tshirt: ["tshirt", "t-shirts", "t-shirt", "tee", "shirt", "t shirt"]
};

function normalize(str) {
  return str ? str.toLowerCase().replace(/[^a-z0-9]/g, "") : "";
}

function matchesCategory(product, selectedCategory) {
  if (!selectedCategory) return true;

  const normalized = normalize(selectedCategory);

  // Use synonyms if present.
  const validTerms = CATEGORY_MAP[normalized] || [normalized];

  // Collect normalised searchable terms from product.
  const productTerms = [
    normalize(product.type),
    ...(product.keyword || []).map(normalize)
  ];

  return productTerms.some((term) => validTerms.includes(term));
}


// RENDER ACTIVE FILTER TAGS
function renderActiveFilters() {
  const container = document.querySelector(".js-active-filters");
  if (!container) return;

  const active = [];

  if (filters.style) active.push({ type: "style", label: filters.style });
  if (filters.category) active.push({ type: "category", label: filters.category });
  if (filters.size) active.push({ type: "size", label: filters.size });
  if (filters.search) active.push({ type: "search", label: filters.search });

  if (active.length === 0) {
    container.innerHTML = "";
    return;
  }

  container.innerHTML = `
    <strong>Active Filters:</strong>
    ${active
      .map(
        (t) => `
          <div class="filter-tag" data-type="${t.type}">
            ${t.label} <span>✕</span>
          </div>
        `
      )
      .join("")}
  `;

  container.querySelectorAll(".filter-tag").forEach((tag) => {
    tag.addEventListener("click", () => {
      filters[tag.dataset.type] = null;
      applyFilters(currentProducts);
    });
  });
}


// MAIN FILTER FUNCTION
let currentProducts = [];

export function applyFilters(products) {
  currentProducts = products;

  const filtered = products.filter((product) => {
    if (filters.style && product.style !== filters.style) return false;

    if (!matchesCategory(product, filters.category)) return false;

    if (filters.size && !product.size.includes(filters.size)) return false;

    if (filters.search) {
      const term = filters.search.toLowerCase();
      const text = (
        product.name +
        " " +
        (product.keyword || []).join(" ")
      ).toLowerCase();
      if (!text.includes(term)) return false;
    }

    return true;
  });

  renderActiveFilters();
  generateHTML(filtered);
  attachProductCardEvents();
}


// INITIALIZE DROPDOWN FILTERS
function initDropdownFilters() {
  document.querySelectorAll(".filter-dropdown").forEach((dropdown) => {
    const filterName = dropdown.dataset.filter; // style, category, size
    const menu = dropdown.querySelector(".filter-menu");
    if (!menu) return;

    menu.querySelectorAll("div").forEach((option) => {
      option.addEventListener("click", () => {
        const value = option.dataset.value || option.textContent.trim();
        filters[filterName] = value;
        applyFilters(currentProducts);
      });
    });
  });
}


// SEARCH BAR INITIALIZATION
function initSearch() {
  const input = document.querySelector(".search-input");
  const button = document.querySelector(".search-btn");
  if (!input || !button) return;

  const searchNow = () => {
    filters.search = input.value.trim() || null;
    applyFilters(currentProducts);
  };

  button.addEventListener("click", searchNow);
  input.addEventListener("keydown", (e) => e.key === "Enter" && searchNow());

  // ?search=abc in URL
  const params = new URLSearchParams(window.location.search);
  const initial = params.get("search");
  if (initial) {
    input.value = initial;
    filters.search = initial;
  }
}

// HERO BROWSE BUTTON
function initHeroButton() {
  const btn = document.querySelector(".hero-browse-btn");
  const section = document.querySelector(".products-section");

  if (btn && section) {
    btn.addEventListener("click", () =>
      section.scrollIntoView({ behavior: "smooth" })
    );
  }
}


// MAIN INITIALIZER (used by men.js, women.js, children.js)
export function initFilterSystem(productList) {
  currentProducts = productList;

  updateCartCountUI();
  generateHTML(productList);
  attachProductCardEvents();

  initDropdownFilters();
  initSearch();
  initHeroButton();
  renderActiveFilters();
}
