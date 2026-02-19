// scripts/checkout.js
import {
  getCartItems,
  updateQuantity,
  removeFromCart,
  clearCart,
  updateCartCountUI
} from "../data/cart.js";
import { formatCurrency } from "../scripts/utils/money.js";


//RENDER CART ITEMS
function renderCartItems(items) {
  const card = document.querySelector(".cart-items-card");
  if (!card) return;

  // Keep the header, remove old rows
  const header = card.querySelector(".cart-header");
  card.innerHTML = "";
  if (header) card.appendChild(header);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.textContent = "Your cart is empty.";
    empty.style.padding = "20px";
    card.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.classList.add("cart-item");
    row.dataset.productId = item.productId;
    row.dataset.size = item.size || "";

    row.innerHTML = `
      <div class="cart-product">
        <img src="${item.image}" alt="${item.name}">
        <div class="item-info">
          <p class="item-name">${item.name}</p>
          <p class="item-size">Size: ${item.size || "-"}</p>
        </div>
      </div>

      <div class="qty-control">
        <button class="js-qty-minus">-</button>
        <span class="js-qty">${item.quantity}</span>
        <button class="js-qty-plus">+</button>
      </div>

      <p class="item-price">£${formatCurrency(
      item.priceCents * item.quantity
    )}</p>

      <button class="delete-btn js-delete"></button>
    `;

    card.appendChild(row);
  });

  attachRowEvents();
}


//ATTACH EVENTS TO ROW BUTTONS
function attachRowEvents() {
  document.querySelectorAll(".cart-item").forEach((row) => {
    const productId = row.dataset.productId;
    const size = row.dataset.size || null;

    const minusBtn = row.querySelector(".js-qty-minus");
    const plusBtn = row.querySelector(".js-qty-plus");
    const deleteBtn = row.querySelector(".js-delete");

    if (minusBtn) {
      minusBtn.addEventListener("click", () => {
        updateQuantity(productId, size, -1);
        render();
      });
    }

    if (plusBtn) {
      plusBtn.addEventListener("click", () => {
        updateQuantity(productId, size, +1);
        render();
      });
    }

    if (deleteBtn) {
      deleteBtn.addEventListener("click", () => {
        removeFromCart(productId, size);
        render();
      });
    }
  });
}


//RENDER SUMMARY
function renderSummary(items) {
  const summaryCard = document.querySelector(".order-summary-card");
  if (!summaryCard) return;

  const summaryRows = summaryCard.querySelectorAll(".summary-row");
  if (summaryRows.length < 4) return;

  const itemsCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalCents = items.reduce(
    (sum, item) => sum + item.priceCents * item.quantity,
    0
  );

  // Example: flat fees when there are items
  const packagingCents = items.length > 0 ? 250 : 0;
  const deliveryCents = items.length > 0 ? 250 : 0;
  const totalCents = subtotalCents + packagingCents + deliveryCents;

  const [itemsRow, subtotalRow, packagingRow, deliveryRow] = summaryRows;
  const totalRow = summaryCard.querySelector(".summary-row.total");

  // Items row: "Items(5):" + subtotal value
  if (itemsRow) {
    const [label, value] = itemsRow.children;
    if (label) label.textContent = `Items(${itemsCount}):`;
    if (value) value.textContent = `£${formatCurrency(subtotalCents)}`;
  }

  // Subtotal
  if (subtotalRow) {
    const value = subtotalRow.children[1];
    if (value) value.textContent = `£${formatCurrency(subtotalCents)}`;
  }

  // Packaging
  if (packagingRow) {
    const value = packagingRow.children[1];
    if (value) value.textContent = `£${formatCurrency(packagingCents)}`;
  }

  // Delivery
  if (deliveryRow) {
    const value = deliveryRow.children[1];
    if (value) value.textContent = `£${formatCurrency(deliveryCents)}`;
  }

  // Total
  if (totalRow) {
    const value = totalRow.children[1];
    if (value) value.textContent = `£${formatCurrency(totalCents)}`;
  }
}


//BUTTONS: CONTINUE + PLACE ORDER
function initButtons() {
  const continueBtn = document.querySelector(".continue-btn");
  if (continueBtn) {
    continueBtn.addEventListener("click", () => {
      // Go back to home; adjust if you want men/women page
      window.location.href = "home.html";
    });
  }

  const placeOrderBtn = document.querySelector(".place-order-btn");
  if (placeOrderBtn) {
    placeOrderBtn.addEventListener("click", () => {
      const items = getCartItems();
      if (!items.length) {
        alert("Your cart is empty.");
        return;
      }

      alert("Thank you for your order!");
      clearCart();
      render();
    });
  }
}


//MAIN RENDER FUNCTION
function render() {
  const items = getCartItems();
  renderCartItems(items);
  renderSummary(items);
  updateCartCountUI();
}


//INIT
render();
initButtons();
