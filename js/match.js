/**
 * FindYourSound — Slice 1 matching
 * Filters curated gear by music style. Extend later for type, budget, etc.
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

/**
 * @param {Array<{styles: string[]}>} gear
 * @param {string} style
 * @returns {typeof gear}
 */
export function getMatches(gear, style) {
  if (!style || !Array.isArray(gear)) return [];
  const key = String(style).toLowerCase();
  return gear.filter(
    (item) =>
      Array.isArray(item.styles) &&
      item.styles.map((s) => s.toLowerCase()).includes(key)
  );
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
