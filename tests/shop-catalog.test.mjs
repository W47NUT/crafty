import assert from "node:assert/strict";
import test from "node:test";

import {
  SHOP_PRODUCT_TYPE_LABELS,
  shopProducts,
} from "../src/data/shop-catalog.ts";

test("shop product types use the approved customer-facing labels", () => {
  assert.deepEqual(SHOP_PRODUCT_TYPE_LABELS, {
    "made-to-order": "Made to order",
    "one-of-one": "One of one",
  });
});

test("the initial catalog is empty instead of presenting sample inventory", () => {
  assert.deepEqual(shopProducts, []);
});
