/**
 * FindYourSound — Slice 1–3 matching
 * Filters curated gear by style, type, and experience level.
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

/**
 * @param {Array<{styles: string[], type: string, levels?: string[]}>} gear
 * @param {{ style: string, type?: string, level?: string }} filters
 * @returns {typeof gear}
 */
export function getMatches(gear, filters = {}) {
  if (!Array.isArray(gear)) return [];
  const style = String(filters.style || "").toLowerCase();
  const type = String(filters.type || "either").toLowerCase();
  const level = String(filters.level || "either").toLowerCase();
  if (!style) return [];

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
