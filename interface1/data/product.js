// data/product.js
import { womenProducts } from "./womenClothing.js";
import { menProducts } from "./menClothing.js";
import { childrenProducts } from "./childrenClothing.js";

export const products = [
  ...womenProducts,
  ...menProducts,
  ...childrenProducts
];

export function getProduct(productId) {
  return products.find((product) => product.id === productId) || null;
}
