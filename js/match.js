/**
 * FindYourSound — Slice 1–4 matching
 * Filters curated gear by style, type, experience level, and budget range.
 */

export const STYLES = ["rock", "blues", "jazz", "folk", "metal", "country"];

export const STYLE_LABELS = {
  rock: "Rock",
  blues: "Blues",
  jazz: "Jazz",
  folk: "Folk",
  metal: "Metal",
  country: "Country",
};

export const TYPE_LABELS = {
  acoustic: "Acoustic",
  electric: "Electric",
  either: "Either / not sure",
};

export const LEVEL_LABELS = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  either: "Any level / not sure",
};

export const BUDGET_MIN = 0;
export const BUDGET_MAX = 5000;
export const BUDGET_STEP = 50;

/**
 * @param {Array<{styles: string[], type: string, levels?: string[], approxPrice?: number}>} gear
 * @param {{ style: string, type?: string, level?: string, budgetMin?: number, budgetMax?: number }} filters
 * @returns {typeof gear}
 */
export function getMatches(gear, filters = {}) {
  if (!Array.isArray(gear)) return [];
  const style = String(filters.style || "").toLowerCase();
  const type = String(filters.type || "either").toLowerCase();
  const level = String(filters.level || "either").toLowerCase();
  let budgetMin = Number(filters.budgetMin);
  let budgetMax = Number(filters.budgetMax);
  if (!style) return [];

  if (!Number.isFinite(budgetMin)) budgetMin = BUDGET_MIN;
  if (!Number.isFinite(budgetMax)) budgetMax = BUDGET_MAX;
  if (budgetMin > budgetMax) {
    const swap = budgetMin;
    budgetMin = budgetMax;
    budgetMax = swap;
  }

  return gear.filter((item) => {
    const stylesOk =
      Array.isArray(item.styles) &&
      item.styles.map((s) => s.toLowerCase()).includes(style);
    if (!stylesOk) return false;

    if (type && type !== "either") {
      if (String(item.type || "").toLowerCase() !== type) return false;
    }

    if (level && level !== "either") {
      const levels = Array.isArray(item.levels)
        ? item.levels.map((l) => l.toLowerCase())
        : [];
      if (!levels.includes(level)) return false;
    }

    const price = Number(item.approxPrice);
    if (!Number.isFinite(price) || price < budgetMin || price > budgetMax) {
      return false;
    }

    return true;
  });
}

/** Resolve path to gear.json from a page under /pages/ */
export function gearDataUrl() {
  return new URL("../data/gear.json", window.location.href).href;
}

export async function loadGear() {
  const res = await fetch(gearDataUrl());
  if (!res.ok) {
    throw new Error(`Could not load gear data (${res.status})`);
  }
  return res.json();
}

export function formatBudget(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return "$0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export function clampBudget(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return BUDGET_MIN;
  return Math.max(BUDGET_MIN, Math.min(BUDGET_MAX, n));
}
