/**
 * FindYourSound — Slice 1–2 matching
 * Filters curated gear by music style and acoustic/electric type.
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

/**
 * @param {Array<{styles: string[], type: string}>} gear
 * @param {{ style: string, type?: string }} filters
 * @returns {typeof gear}
 */
export function getMatches(gear, filters = {}) {
  if (!Array.isArray(gear)) return [];
  const style = String(filters.style || "").toLowerCase();
  const type = String(filters.type || "either").toLowerCase();
  if (!style) return [];

  return gear.filter((item) => {
    const stylesOk =
      Array.isArray(item.styles) &&
      item.styles.map((s) => s.toLowerCase()).includes(style);
    if (!stylesOk) return false;
    if (!type || type === "either") return true;
    return String(item.type || "").toLowerCase() === type;
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
