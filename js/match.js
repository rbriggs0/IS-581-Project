/**
 * FindYourSound — Slice 1–6 + Phase 3 matching
 * Filters curated gear by style, type, experience, budget, handedness,
 * primary use (soft), and optional favorite-artist inspiration.
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

export const HAND_LABELS = {
  right: "Right-handed",
  left: "Left-handed",
  either: "Either / not sure",
};

export const USE_LABELS = {
  practice: "Practice / learning at home",
  songwriting: "Songwriting",
  recording: "Recording / studio",
  live: "Live / gigging",
  travel: "Travel / on the go",
  either: "Any use / not sure",
};

export const BUDGET_MIN = 0;
export const BUDGET_MAX = 5000;
export const BUDGET_STEP = 50;

/**
 * @param {Array<{styles: string[], type: string, levels?: string[], hands?: string[], approxPrice?: number}>} gear
 * @param {{ style: string, type?: string, level?: string, hand?: string, budgetMin?: number, budgetMax?: number }} filters
 * @returns {typeof gear}
 */
export function getMatches(gear, filters = {}) {
  if (!Array.isArray(gear)) return [];
  const style = String(filters.style || "").toLowerCase();
  const type = String(filters.type || "either").toLowerCase();
  const level = String(filters.level || "either").toLowerCase();
  const hand = String(filters.hand || "either").toLowerCase();
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

    if (hand && hand !== "either") {
      const hands = Array.isArray(item.hands)
        ? item.hands.map((h) => h.toLowerCase())
        : ["right"];
      if (!hands.includes(hand)) return false;
    }

    const price = Number(item.approxPrice);
    if (!Number.isFinite(price) || price < budgetMin || price > budgetMax) {
      return false;
    }

    return true;
  });
}

function sortLevelPreferred(matches, level) {
  const want = String(level || "").toLowerCase();
  return [...matches].sort((a, b) => {
    const aLevels = Array.isArray(a.levels)
      ? a.levels.map((l) => l.toLowerCase())
      : [];
    const bLevels = Array.isArray(b.levels)
      ? b.levels.map((l) => l.toLowerCase())
      : [];
    const aHit = aLevels.includes(want) ? 0 : 1;
    const bHit = bLevels.includes(want) ? 0 : 1;
    if (aHit !== bHit) return aHit - bHit;
    return (Number(a.approxPrice) || 0) - (Number(b.approxPrice) || 0);
  });
}

function sortArtistPreferred(matches, gearIds) {
  const preferred = new Set(
    (Array.isArray(gearIds) ? gearIds : []).map((id) => String(id))
  );
  return [...matches].sort((a, b) => {
    const aHit = preferred.has(a.id) ? 0 : 1;
    const bHit = preferred.has(b.id) ? 0 : 1;
    if (aHit !== bHit) return aHit - bHit;
    return (Number(a.approxPrice) || 0) - (Number(b.approxPrice) || 0);
  });
}

/** Signature → artist → use → level → price. */
function sortMatches(
  matches,
  {
    signatureGearIds = [],
    gearIds = [],
    level = "either",
    use = "either",
  } = {}
) {
  const signatures = new Set(
    (Array.isArray(signatureGearIds) ? signatureGearIds : []).map((id) =>
      String(id)
    )
  );
  const preferred = new Set(
    (Array.isArray(gearIds) ? gearIds : []).map((id) => String(id))
  );
  const wantLevel = String(level || "either").toLowerCase();
  const wantUse = String(use || "either").toLowerCase();
  return [...matches].sort((a, b) => {
    const aSig = signatures.has(a.id) ? 0 : 1;
    const bSig = signatures.has(b.id) ? 0 : 1;
    if (aSig !== bSig) return aSig - bSig;

    const aArt = preferred.has(a.id) ? 0 : 1;
    const bArt = preferred.has(b.id) ? 0 : 1;
    if (aArt !== bArt) return aArt - bArt;

    if (wantUse && wantUse !== "either") {
      const aUses = Array.isArray(a.uses)
        ? a.uses.map((u) => u.toLowerCase())
        : [];
      const bUses = Array.isArray(b.uses)
        ? b.uses.map((u) => u.toLowerCase())
        : [];
      const aUse = aUses.includes(wantUse) ? 0 : 1;
      const bUse = bUses.includes(wantUse) ? 0 : 1;
      if (aUse !== bUse) return aUse - bUse;
    }

    if (wantLevel && wantLevel !== "either") {
      const aLevels = Array.isArray(a.levels)
        ? a.levels.map((l) => l.toLowerCase())
        : [];
      const bLevels = Array.isArray(b.levels)
        ? b.levels.map((l) => l.toLowerCase())
        : [];
      const aLvl = aLevels.includes(wantLevel) ? 0 : 1;
      const bLvl = bLevels.includes(wantLevel) ? 0 : 1;
      if (aLvl !== bLvl) return aLvl - bLvl;
    }

    return (Number(a.approxPrice) || 0) - (Number(b.approxPrice) || 0);
  });
}

function artistLinkIds(artist) {
  if (!artist) return [];
  const sig = Array.isArray(artist.signatureGearIds)
    ? artist.signatureGearIds
    : [];
  const gear = Array.isArray(artist.gearIds) ? artist.gearIds : [];
  return [...new Set([...sig, ...gear])];
}

export function findArtist(artists, artistId) {
  if (!artistId || !Array.isArray(artists)) return null;
  const want = String(artistId).toLowerCase();
  return (
    artists.find((a) => String(a.id || "").toLowerCase() === want) || null
  );
}

/**
 * Match with budget/style/type/hand as hard filters.
 * Experience is a soft preference (sort + gift-friendly)—never the only reason
 * to hide a guitar that otherwise fits.
 * Optional artist boosts linked gear; if none survive filters, keep style matches
 * (genre fallback) with a clear notice.
 */
export function getMatchResult(gear, filters = {}, artists = []) {
  const level = String(filters.level || "either").toLowerCase();
  const use = String(filters.use || "either").toLowerCase();
  const artist = findArtist(artists, filters.artist);
  // Level + use are soft: filter without them, then prefer when sorting
  const hardFilters = { ...filters, level: "either", use: "either" };
  let matches = getMatches(gear, hardFilters);
  let levelRelaxed = false;
  let artistMode = null;
  let inspiredIds = new Set();
  let signatureIds = new Set();

  if (level && level !== "either" && matches.length) {
    const strict = getMatches(gear, { ...filters, use: "either" });
    if (strict.length && strict.length < matches.length) {
      levelRelaxed = true;
    }
  }

  if (artist && matches.length) {
    const linkIds = artistLinkIds(artist);
    const sigIds = Array.isArray(artist.signatureGearIds)
      ? artist.signatureGearIds
      : [];
    const linked = matches.filter((item) => linkIds.includes(item.id));
    const sigHits = matches.filter((item) => sigIds.includes(item.id));
    if (sigHits.length) {
      signatureIds = new Set(sigHits.map((item) => item.id));
    }
    if (linked.length) {
      inspiredIds = new Set(linked.map((item) => item.id));
      artistMode = "boosted";
    } else {
      artistMode = "genre-fallback";
    }
  }

  if (matches.length) {
    matches = sortMatches(matches, {
      signatureGearIds: artist?.signatureGearIds || [],
      gearIds: artistLinkIds(artist),
      level,
      use,
    });
  }

  // Empty after filters: try artist's primary style as genre fallback (keep other filters)
  if (!matches.length && artist) {
    const artistStyles = Array.isArray(artist.styles)
      ? artist.styles.map((s) => String(s).toLowerCase())
      : [];
    for (const style of artistStyles) {
      if (style === String(filters.style || "").toLowerCase()) continue;
      const alt = getMatches(gear, {
        ...filters,
        style,
        level: "either",
        use: "either",
      });
      if (alt.length) {
        matches = sortMatches(alt, {
          signatureGearIds: artist.signatureGearIds || [],
          gearIds: artistLinkIds(artist),
          level,
          use,
        });
        inspiredIds = new Set(
          matches
            .filter((item) => artistLinkIds(artist).includes(item.id))
            .map((item) => item.id)
        );
        signatureIds = new Set(
          matches
            .filter((item) =>
              (artist.signatureGearIds || []).includes(item.id)
            )
            .map((item) => item.id)
        );
        artistMode = "genre-fallback";
        levelRelaxed = true;
        break;
      }
    }
  }

  const notice = buildMatchNotice(filters, {
    levelRelaxed,
    matches,
    artist,
    artistMode,
  });
  return {
    matches,
    levelRelaxed,
    notice,
    artist,
    artistMode,
    inspiredIds,
    signatureIds,
  };
}

function buildMatchNotice(filters, { levelRelaxed, matches, artist, artistMode }) {
  if (!matches.length) return null;

  if (artist && artistMode === "genre-fallback") {
    return `Nothing in your filters lined up with gear we link to ${artist.name}, so we kept matches for your style (and budget)—same spirit, not a 1:1 hero copy.`;
  }

  if (artist && artistMode === "boosted") {
    const style = String(filters.style || "").toLowerCase();
    const artistStyles = Array.isArray(artist.styles)
      ? artist.styles.map((s) => String(s).toLowerCase())
      : [];
    if (style && artistStyles.length && !artistStyles.includes(style)) {
      return `${artist.name} is often tied more to ${artistStyles
        .map((s) => STYLE_LABELS[s] || s)
        .join(" / ")}; we kept your ${STYLE_LABELS[style] || style} picks and floated any overlapping inspiration to the top.`;
    }
  }

  if (levelRelaxed && !(artist && artistMode === "genre-fallback")) {
    return "Experience is a preference, not a gate—so we included more guitars in your style and budget (including ones tagged for other levels). Gift shopping and “I’ll grow into it” both count.";
  }

  const level = String(filters.level || "either").toLowerCase();
  let budgetMax = Number(filters.budgetMax);
  if (!Number.isFinite(budgetMax)) budgetMax = BUDGET_MAX;

  if (level === "beginner" && budgetMax >= 1200) {
    return "Your budget is above many first-guitar price tags—that’s normal for gifts or buying something you’ll grow into. Matches below are in your range; experience tags are a guide, not a limit.";
  }

  if (level === "advanced" && budgetMax <= 600) {
    return "Strong gear shows up at every price. We’re showing what fits your style and budget—experience level is a nudge, not a gate.";
  }

  return null;
}

/** Resolve path to gear.json from a page under /pages/ */
export function gearDataUrl() {
  return new URL("../data/gear.json", window.location.href).href;
}

export function gearExtrasDataUrl() {
  return new URL("../data/gear-extras.json", window.location.href).href;
}

export function artistsDataUrl() {
  return new URL("../data/artists.json", window.location.href).href;
}

function mergeGearExtras(gear, extras) {
  if (!Array.isArray(gear)) return [];
  const map = extras && typeof extras === "object" ? extras : {};
  return gear.map((item) => {
    const extra = map[item.id];
    if (!extra) return item;
    return {
      ...item,
      visual: extra.visual || item.visual,
      specs: extra.specs || item.specs,
      image: extra.image || item.image,
      uses: extra.uses || item.uses,
    };
  });
}

export async function loadGear() {
  const [gearRes, extrasRes] = await Promise.all([
    fetch(gearDataUrl()),
    fetch(gearExtrasDataUrl()),
  ]);
  if (!gearRes.ok) {
    throw new Error(`Could not load gear data (${gearRes.status})`);
  }
  const gear = await gearRes.json();
  if (!extrasRes.ok) {
    return gear;
  }
  const extras = await extrasRes.json();
  return mergeGearExtras(gear, extras);
}

export async function loadArtists() {
  const res = await fetch(artistsDataUrl());
  if (!res.ok) {
    throw new Error(`Could not load artist data (${res.status})`);
  }
  return res.json();
}

/** Artists grouped by primary style for quiz optgroups. */
export function artistsByStyle(artists) {
  const groups = {};
  for (const style of STYLES) {
    groups[style] = [];
  }
  for (const artist of Array.isArray(artists) ? artists : []) {
    const primary = String(
      (Array.isArray(artist.styles) && artist.styles[0]) || ""
    ).toLowerCase();
    if (groups[primary]) {
      groups[primary].push(artist);
    }
  }
  for (const style of STYLES) {
    groups[style].sort((a, b) =>
      String(a.name).localeCompare(String(b.name))
    );
  }
  return groups;
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

/** Short label for result cards when a model is sold left-handed. */
export function handAvailabilityLabel(item) {
  const hands = Array.isArray(item?.hands)
    ? item.hands.map((h) => String(h).toLowerCase())
    : ["right"];
  if (hands.includes("left") && hands.includes("right")) {
    return "Lefty available";
  }
  if (hands.includes("left") && !hands.includes("right")) {
    return "Left-handed";
  }
  return null;
}
