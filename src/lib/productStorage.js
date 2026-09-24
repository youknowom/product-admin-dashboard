// src/lib/productStorage.js
/**
 * Utility for persisting mock mutations (Create, Update, Delete) locally.
 * Because DummyJSON simulates mutations without persisting them on their server,
 * this overlay ensures changes remain visible across navigation and page refreshes.
 */

const STORAGE_KEYS = {
  CREATED: "mock_created_products",
  UPDATED: "mock_updated_products",
  DELETED: "mock_deleted_product_ids",
};

export const getLocalCreatedProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CREATED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveLocalCreatedProduct = (product) => {
  if (typeof window === "undefined") return;
  const existing = getLocalCreatedProducts();
  const updated = [product, ...existing.filter((p) => p.id !== product.id)];
  localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(updated));
};

export const getLocalUpdatedProducts = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UPDATED);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const saveLocalUpdatedProduct = (id, changes) => {
  if (typeof window === "undefined") return;
  const existing = getLocalUpdatedProducts();
  const current = existing[id] || {};
  existing[id] = { ...current, ...changes };
  localStorage.setItem(STORAGE_KEYS.UPDATED, JSON.stringify(existing));

  // Also update if it was an item in created products
  const created = getLocalCreatedProducts();
  const createdIdx = created.findIndex((p) => String(p.id) === String(id));
  if (createdIdx !== -1) {
    created[createdIdx] = { ...created[createdIdx], ...changes };
    localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(created));
  }
};

export const getLocalDeletedIds = () => {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DELETED);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const markProductDeleted = (id) => {
  if (typeof window === "undefined") return;
  const deleted = getLocalDeletedIds();
  const idStr = String(id);
  if (!deleted.includes(idStr)) {
    deleted.push(idStr);
    localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(deleted));
  }

  // Remove from local created products if present
  const created = getLocalCreatedProducts();
  const filtered = created.filter((p) => String(p.id) !== idStr);
  localStorage.setItem(STORAGE_KEYS.CREATED, JSON.stringify(filtered));
};

export const applyLocalMutations = (serverProducts) => {
  const deletedIds = new Set(getLocalDeletedIds().map(String));
  const updatedMap = getLocalUpdatedProducts();

  // 1. Filter out deleted products and merge updated fields
  const filtered = serverProducts
    .filter((p) => !deletedIds.has(String(p.id)))
    .map((p) => {
      const updates = updatedMap[p.id];
      return updates ? { ...p, ...updates } : p;
    });

  return filtered;
};
