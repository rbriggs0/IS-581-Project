/**
 * FindYourSound — Phase 3 visuals
 * Lightweight SVG silhouettes by body shape (not product photos).
 */

const SVGS = {
  strat: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M36 8h8v52l14 8v14l-14 6v64c0 6-3 10-8 10s-8-4-8-10V88l-14-6V68l14-8V8z"/><circle cx="40" cy="78" r="3" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="92" r="3" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="106" r="3" fill="var(--paper, #f7f3eb)"/></svg>`,
  tele: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M35 8h10v54l16 4v18l-16 4v64c0 5-3 8-8 8s-8-3-8-8V88l-14-4V66l14-4V8z"/><rect x="34" y="74" width="12" height="8" rx="1" fill="var(--paper, #f7f3eb)"/><rect x="34" y="96" width="12" height="8" rx="1" fill="var(--paper, #f7f3eb)"/></svg>`,
  "les-paul": `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M34 8h12v48c18 8 22 28 8 42l-8 4v50c0 6-3 10-8 10s-8-4-8-10v-50l-8-4c-14-14-10-34 8-42V8z"/><circle cx="40" cy="88" r="5" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="108" r="5" fill="var(--paper, #f7f3eb)"/></svg>`,
  sg: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M36 8h8v50c16 2 24 22 10 38l-10 6v50c0 5-3 8-8 8s-8-3-8-8V102l-10-6C4 80 12 60 28 58V8z"/><circle cx="40" cy="86" r="4" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="104" r="4" fill="var(--paper, #f7f3eb)"/></svg>`,
  superstrat: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M37 6h6v50l18 14-6 10-12-4v70c0 5-2 8-7 8s-7-3-7-8V76l-12 4-6-10 18-14V6z"/><circle cx="40" cy="82" r="3" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="96" r="3" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="110" r="3" fill="var(--paper, #f7f3eb)"/></svg>`,
  rhoads: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M38 6h4v48L72 86l-10 8-20-18v70c0 5-2 8-6 8s-6-3-6-8V76L10 94 0 86l34-32V6z"/><circle cx="40" cy="88" r="4" fill="var(--paper, #f7f3eb)"/><circle cx="40" cy="106" r="4" fill="var(--paper, #f7f3eb)"/></svg>`,
  hollow: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M34 8h12v46c20 10 24 36 6 52l-6 4v42c0 5-3 8-8 8s-8-3-8-8v-42l-6-4c-18-16-14-42 6-52V8z"/><ellipse cx="40" cy="96" rx="10" ry="14" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  jazzbox: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M32 10h16v44c22 12 26 40 4 58l-8 4v36c0 5-3 8-8 8s-8-3-8-8v-36l-8-4c-22-18-18-46 4-58V10z"/><ellipse cx="40" cy="98" rx="12" ry="16" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  dreadnought: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M36 6h8v52c22 8 28 40 8 62l-8 6v26c0 4-2 6-6 6s-6-2-6-6v-26l-8-6c-20-22-14-54 8-62V6z"/><circle cx="40" cy="100" r="12" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  ga: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M36 6h8v50c18 6 26 36 10 56l-10 8 8 22h-24l8-22-10-8c-16-20-8-50 10-56V6z"/><circle cx="40" cy="98" r="11" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  orchestra: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M37 6h6v52c16 6 22 32 8 50l-7 6v28c0 4-2 6-5 6s-5-2-5-6v-28l-7-6c-14-18-8-44 8-50V6z"/><circle cx="40" cy="100" r="10" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  classical: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M37 8h6v48c18 10 22 38 6 56l-6 6v30c0 4-2 6-5 6s-5-2-5-6v-30l-6-6c-16-18-12-46 6-56V8z"/><circle cx="40" cy="100" r="11" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="3"/></svg>`,
  resonator: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M36 6h8v50c20 8 26 36 8 56l-8 6v30c0 4-2 6-6 6s-6-2-6-6v-30l-8-6c-18-20-12-48 8-56V6z"/><circle cx="40" cy="100" r="14" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="2"/><circle cx="40" cy="100" r="6" fill="var(--paper, #f7f3eb)"/></svg>`,
  hybrid: `<svg viewBox="0 0 80 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path fill="currentColor" d="M35 8h10v52l16 6v16l-16 4v62c0 5-3 8-8 8s-8-3-8-8V86l-12-4V66l12-6V8z"/><circle cx="40" cy="96" r="8" fill="none" stroke="var(--paper, #f7f3eb)" stroke-width="2"/><rect x="34" y="112" width="12" height="6" rx="1" fill="var(--paper, #f7f3eb)"/></svg>`,
};

const FALLBACK = {
  electric: "strat",
  acoustic: "dreadnought",
};

/**
 * @param {{ visual?: string, type?: string }} item
 * @returns {string} SVG markup
 */
export function gearVisualSvg(item) {
  const key =
    (item && item.visual && SVGS[item.visual] && item.visual) ||
    FALLBACK[String(item?.type || "").toLowerCase()] ||
    "strat";
  return SVGS[key] || SVGS.strat;
}

/**
 * @param {{ specs?: Record<string, string> }} item
 * @returns {{ label: string, value: string }[]}
 */
export function gearSpecRows(item) {
  const specs = item?.specs;
  if (!specs || typeof specs !== "object") return [];
  const order = ["body", "neck", "electronics", "notable"];
  const labels = {
    body: "Body",
    neck: "Neck",
    electronics: "Electronics",
    notable: "Notable",
  };
  return order
    .filter((key) => specs[key])
    .map((key) => ({ label: labels[key] || key, value: String(specs[key]) }));
}
