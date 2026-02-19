// scripts/product-view.js

import { getProduct, products } from "../data/product.js";
import { addToCart, updateCartCountUI } from "../data/cart.js";
import { formatCurrency } from "./utils/money.js";


//GET PRODUCT ID FROM URL

const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const productContainer = document.querySelector(".js-product-view");
const breadcrumbEl = document.querySelector(".js-breadcrumb");


//RENDER MAIN PRODUCT LAYOUT (matches CSS)

function renderProduct(product) {
  // breadcrumb – simple example, you can refine later
  if (breadcrumbEl) {
    breadcrumbEl.textContent = `Women > ${product.type}`;
  }

  productContainer.innerHTML = `
    <div class="gallery-section">
      <img src="${product.image}" class="main-image js-main-image" alt="${product.name}">
      <div class="thumbnail-column js-thumbnails">
        <img src="${product.image}" class="thumb active-thumb" alt="${product.name}">
        <img src="${product.image}" class="thumb" alt="${product.name}">
        <img src="${product.image}" class="thumb" alt="${product.name}">
      </div>
    </div>

    <div class="product-info">
      <h1 class="product-title">${product.name}</h1>
      <div class="stars">${"★".repeat(Math.floor(product.rating.stars))}</div>
      <p class="product-price">£${formatCurrency(product.priceCents)}</p>

      <!-- COLOUR + QUANTITY ROW -->
      <div class="info-row">
        <div>
          <div class="label">Available Colour</div>
          <div class="colour-options">
            <div class="colour-dot beige"></div>
            <div class="colour-dot cream"></div>
          </div>
        </div>

        <div class="qty-block">
          <div class="label">Quantity</div>
          <div class="qty-box">
            <button class="js-minus">-</button>
            <span class="js-qty">1</span>
            <button class="js-plus">+</button>
          </div>
        </div>
      </div>

      <!-- SIZE -->
      <div class="size-label label">Available Size</div>
      <div class="size-options js-size-options">
        ${product.size
      .map((s) => `<div class="size js-size" data-size="${s}">${s}</div>`)
      .join("")}
      </div>

      <!-- BUTTONS -->
      <div class="button-row">
        <button class="buy-now js-buy-now">BUY IT NOW</button>
        <button class="add-cart js-add-cart">ADD TO CART</button>
      </div>

      <!-- DETAILS / REVIEWS TABS -->
      <div class="details-block">
        <div class="tabs">
          <div class="tab js-tab active-tab" data-tab="details">Details</div>
          <div class="tab js-tab" data-tab="reviews">Reviews</div>
        </div>

        <!-- DETAILS CONTENT -->
        <div class="tab-content js-tab-details">
          <p>Premium quality embroidery/print on a soft, cosy sweatshirt. Designed for everyday comfort.</p>
        </div>

        <!-- REVIEWS CONTENT (Instagram-style) -->
        <div class="tab-content js-tab-reviews" style="display: none;">
          <div class="review-heading">Review List</div>

          <div class="review-card">
            <img src="images/home/socialmediaIcons/instaLogo.png" class="avatar" alt="Instagram Icon">
            <div>
              <p><strong>Jude Bubblegum</strong> (2 days ago)</p>
              <p class="review-stars">★★★★★</p>
              <p class="review-text">
                Excellent quality! Got me thinking, why isn't it more expensive?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}


//INTERACTIVITY

function attachProductEvents(product) {
  let selectedSize = null;
  let quantity = 1;

  /* SIZE SELECTION */
  const sizeEls = document.querySelectorAll(".js-size");
  sizeEls.forEach((el) => {
    el.addEventListener("click", () => {
      // simple inline highlight (no CSS file changes)
      sizeEls.forEach((s) => {
        s.style.backgroundColor = "";
        s.style.color = "";
      });
      el.style.backgroundColor = "black";
      el.style.color = "white";
      selectedSize = el.dataset.size;
    });
  });

  /* QUANTITY BUTTONS */
  const qtySpan = document.querySelector(".js-qty");
  const minusBtn = document.querySelector(".js-minus");
  const plusBtn = document.querySelector(".js-plus");

  minusBtn.addEventListener("click", () => {
    if (quantity > 1) {
      quantity--;
      qtySpan.textContent = quantity;
    }
  });

  plusBtn.addEventListener("click", () => {
    quantity++;
    qtySpan.textContent = quantity;
  });

  /* THUMBNAILS -> MAIN IMAGE */
  const mainImg = document.querySelector(".js-main-image");
  const thumbs = document.querySelectorAll(".thumb");

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => {
      mainImg.src = thumb.src;
      thumbs.forEach((t) => t.classList.remove("active-thumb"));
      thumb.classList.add("active-thumb");
    });
  });

  /* ADD TO CART */
  const addBtn = document.querySelector(".js-add-cart");
  addBtn.addEventListener("click", () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart(product.id, quantity, selectedSize);
    updateCartCountUI();

    const originalText = addBtn.textContent;
    addBtn.textContent = "Added!";
    addBtn.disabled = true;

    setTimeout(() => {
      addBtn.textContent = originalText;
      addBtn.disabled = false;
    }, 800);
  });

  /* BUY IT NOW */
  const buyNowBtn = document.querySelector(".js-buy-now");
  buyNowBtn.addEventListener("click", () => {
    if (!selectedSize) {
      alert("Please select a size.");
      return;
    }

    addToCart(product.id, quantity, selectedSize);
    window.location.href = "checkout.html";
  });

  /* TABS (DETAILS / REVIEWS) */
  const tabs = document.querySelectorAll(".js-tab");
  const detailsTab = document.querySelector(".js-tab-details");
  const reviewsTab = document.querySelector(".js-tab-reviews");

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active-tab"));
      tab.classList.add("active-tab");

      if (tab.dataset.tab === "details") {
        detailsTab.style.display = "block";
        reviewsTab.style.display = "none";
      } else {
        detailsTab.style.display = "none";
        reviewsTab.style.display = "block";
      }
    });
  });
}


//CONTINUE SHOPPING + SEARCH + INIT

function initContinueButton() {
  const btn = document.querySelector(".js-continue");
  if (!btn) return;
  btn.addEventListener("click", () => {
    window.location.href = "home.html";
  });
}

function initHeaderSearch() {
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

function init() {
  updateCartCountUI();
  initContinueButton();
  initHeaderSearch();

  if (!productId) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  const product = getProduct(productId);
  if (!product) {
    productContainer.innerHTML = "<p>Product not found.</p>";
    return;
  }

  renderProduct(product);
  attachProductEvents(product);
}

init();
