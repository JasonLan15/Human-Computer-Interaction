// scripts/shared/general.js
import { formatCurrency } from "../utils/money.js";
import { addToCart, updateCartCountUI } from "../../data/cart.js";

export function generateHTML(productData) {
  let productsHTML = "";

  for (let i = 0; i < productData.length; i++) {
    const product = productData[i];
    const cardClass = i % 2 === 0 ? "product-card-green" : "product-card-beige";

    productsHTML += `
      <div class="product-card ${cardClass}">
        <a href="product-view.html?id=${product.id}">
          <img src="${product.image}" alt="${product.name}" />
        </a>

        <div class="product-card-content">
          <p class="product-name"><strong>${product.name}</strong></p>

          <div class="product-row">
            <strong>Size:</strong>
            <select class="product-select js-size-selector" data-product-id="${product.id}">
              <option value="">Select</option>
              ${product.size
        .map((s) => `<option value="${s}">${s}</option>`)
        .join("")}
            </select>
          </div>

          <div class="product-row">
            <strong>Price:</strong>
            <span class="product-price">
              £${formatCurrency(product.priceCents)}
            </span>
          </div>

          <div class="product-row">
            <strong>Quantity:</strong>
            <select class="product-select product-select-quantity js-quantity-selector" data-product-id="${product.id}">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          <button class="add-to-cart-btn" data-product-id="${product.id}">
            Add to Cart
          </button>
        </div>
      </div>
    `;
  }

  const container = document.querySelector(".js-products");
  if (container) {
    container.innerHTML = productsHTML;
  }
}

export function attachProductCardEvents() {
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.dataset.productId;
      const sizeSelect = document.querySelector(
        `.js-size-selector[data-product-id="${productId}"]`
      );
      const qtySelect = document.querySelector(
        `.js-quantity-selector[data-product-id="${productId}"]`
      );

      const size = sizeSelect ? sizeSelect.value : null;
      const quantity = qtySelect ? Number(qtySelect.value) : 1;

      if (!size) {
        alert("Please select a size.");
        return;
      }

      addToCart(productId, quantity, size);
      updateCartCountUI();

      const originalText = button.textContent;
      button.textContent = "Added!";
      button.disabled = true;

      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 800);
    });
  });
}
