// scripts/data/cart.js
// UNIFIED CART SYSTEM

// Import ALL product lists
import { childrenProducts } from "./childrenClothing.js";
import { menProducts } from "./menClothing.js";
import { womenProducts } from "./womenClothing.js";


//Join each product object separately.
export const allProducts = [
  ...childrenProducts,
  ...menProducts,
  ...womenProducts
];


// CART STATE (LocalStorage).
export let cart = JSON.parse(localStorage.getItem("cart")) || [];

//Saves to localStorage.
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

//Adds to cart.
export function addToCart(productId, quantity = 1, size = null) {
  quantity = Number(quantity);

  let existing = cart.find(
    item => item.productId === productId && item.size === size
  );

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push({
      productId,
      size,
      quantity
    });
  }

  saveCart();
  updateCartCountUI();
}


export function updateQuantity(productId, size, change) {
  const item = cart.find(i => i.productId === productId && i.size === size);
  if (!item) return;

  item.quantity += change;

  if (item.quantity < 1) {
    removeFromCart(productId, size);
    return;
  }

  saveCart();
  updateCartCountUI();
}


export function removeFromCart(productId, size) {
  cart = cart.filter(
    item => !(item.productId === productId && item.size === size)
  );

  saveCart();
  updateCartCountUI();
}


// Get cart items including product date.
export function getCartItems() {
  return cart.map(item => {
    const product = allProducts.find(p => p.id === item.productId);

    return {
      ...product,
      ...item
    };
  });
}


//Updates the count of the basket in the header.
export function updateCartCountUI() {
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const countElement = document.querySelector(".cart-count");

  if (countElement) countElement.textContent = count;
}


export function clearCart() {
  cart = [];
  saveCart();
  updateCartCountUI();
}
