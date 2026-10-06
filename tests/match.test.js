import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  getMatches,
  getMatchResult,
  findArtist,
  formatBudget,
  clampBudget,
  handAvailabilityLabel,
  artistsByStyle,
  BUDGET_MIN,
  BUDGET_MAX,
} from "../js/match.js";
import { loadCatalog, loadArtistData } from "./helpers.js";

const gear = loadCatalog();
const artists = loadArtistData();
const ids = (items) => items.map((item) => item.id);

describe("getMatches (hard filters)", () => {
  it("returns nothing without a style", () => {
    assert.deepEqual(getMatches(gear, {}), []);
  });

  it("returns nothing for non-array input", () => {
    assert.deepEqual(getMatches(null, { style: "rock" }), []);
  });

  it("keeps only the chosen style", () => {
    const matches = getMatches(gear, { style: "jazz" });
    assert.ok(matches.length > 0);
    for (const item of matches) assert.ok(item.styles.includes("jazz"));
  });

  it("filters by guitar type", () => {
    const matches = getMatches(gear, { style: "rock", type: "acoustic" });
    assert.ok(matches.length > 0);
    for (const item of matches) assert.equal(item.type, "acoustic");
  });

  it("filters left-handed availability", () => {
    const matches = getMatches(gear, { style: "rock", hand: "left" });
    assert.ok(matches.length > 0);
    for (const item of matches) assert.ok(item.hands.includes("left"));
    assert.ok(!ids(matches).includes("prs-silver-sky"));
  });

  it("respects the budget range", () => {
    const matches = getMatches(gear, {
      style: "rock",
      budgetMin: 500,
      budgetMax: 900,
    });
    assert.ok(matches.length > 0);
    for (const item of matches) {
      assert.ok(item.approxPrice >= 500 && item.approxPrice <= 900);
    }
  });

  it("swaps an inverted budget range instead of returning nothing", () => {
    const normal = getMatches(gear, {
      style: "rock",
      budgetMin: 200,
      budgetMax: 1000,
    });
    const inverted = getMatches(gear, {
      style: "rock",
      budgetMin: 1000,
      budgetMax: 200,
    });
    assert.deepEqual(ids(inverted), ids(normal));
  });
});

describe("getMatchResult (soft preferences and artists)", () => {
  it("treats experience as a preference, not a gate", () => {
    const strict = getMatches(gear, { style: "rock", level: "advanced" });
    const { matches, levelRelaxed } = getMatchResult(gear, {
      style: "rock",
      level: "advanced",
    });
    assert.ok(matches.length > strict.length);
    assert.equal(levelRelaxed, true);
    assert.ok(matches[0].levels.includes("advanced"));
  });

  it("puts John Mayer signatures first", () => {
    const { matches, signatureIds, artistMode } = getMatchResult(
      gear,
      { style: "blues", type: "electric", artist: "john-mayer" },
      artists
    );
    assert.equal(artistMode, "boosted");
    assert.ok(signatureIds.has("prs-se-silver-sky"));
    assert.ok(signatureIds.has(matches[0].id));
  });

  it("puts Rzeznik's Taylors first for rock + advanced + $3,900", () => {
    const { matches } = getMatchResult(
      gear,
      {
        style: "rock",
        level: "advanced",
        artist: "john-rzeznik",
        budgetMin: 0,
        budgetMax: 3900,
      },
      artists
    );
    assert.ok(matches.length > 2, "should not collapse to two results");
    assert.equal(matches[0].id, "taylor-314ce");
  });

  it("drops a signature that is over budget", () => {
    const { matches } = getMatchResult(
      gear,
      { style: "blues", artist: "john-mayer", budgetMax: 1000 },
      artists
    );
    assert.ok(!ids(matches).includes("prs-silver-sky"));
  });

  it("sorts guitars tagged for the chosen use ahead of others", () => {
    const { matches } = getMatchResult(gear, { style: "folk", use: "travel" });
    const firstMiss = matches.findIndex(
      (item) => !(item.uses || []).includes("travel")
    );
    const lastHit = matches.findLastIndex((item) =>
      (item.uses || []).includes("travel")
    );
    if (firstMiss !== -1 && lastHit !== -1) {
      assert.ok(lastHit < firstMiss);
    }
  });

  it("never hides a guitar because of primary use", () => {
    const base = getMatches(gear, { style: "folk" });
    const { matches } = getMatchResult(gear, { style: "folk", use: "live" });
    assert.equal(matches.length, base.length);
  });

  it("explains a genre fallback when no artist gear fits", () => {
    const { artistMode, notice } = getMatchResult(
      gear,
      { style: "metal", artist: "joni-mitchell" },
      artists
    );
    assert.equal(artistMode, "genre-fallback");
    assert.match(notice, /Joni Mitchell/);
  });

  it("shows a gift-friendly note for beginners with a big budget", () => {
    const { matches, notice } = getMatchResult(gear, {
      style: "folk",
      level: "beginner",
      budgetMin: 0,
      budgetMax: 5000,
    });
    assert.ok(matches.length > 0);
    assert.match(notice, /gift/i);
  });

  it("shows no notice when no preference was relaxed", () => {
    const { notice } = getMatchResult(gear, { style: "jazz" });
    assert.equal(notice, null);
  });
});

describe("helpers", () => {
  it("findArtist is case-insensitive and null-safe", () => {
    assert.equal(findArtist(artists, "SLASH").name, "Slash");
    assert.equal(findArtist(artists, "nobody"), null);
    assert.equal(findArtist(null, "slash"), null);
  });

  it("formatBudget renders whole US dollars", () => {
    assert.equal(formatBudget(1250), "$1,250");
    assert.equal(formatBudget("abc"), "$0");
  });

  it("clampBudget keeps values within the dial range", () => {
    assert.equal(clampBudget(-50), BUDGET_MIN);
    assert.equal(clampBudget(99999), BUDGET_MAX);
    assert.equal(clampBudget("nope"), BUDGET_MIN);
  });

  it("handAvailabilityLabel describes lefty options", () => {
    assert.equal(
      handAvailabilityLabel({ hands: ["right", "left"] }),
      "Lefty available"
    );
    assert.equal(handAvailabilityLabel({ hands: ["left"] }), "Left-handed");
    assert.equal(handAvailabilityLabel({ hands: ["right"] }), null);
  });

  it("artistsByStyle groups by primary style, sorted by name", () => {
    const groups = artistsByStyle(artists);
    const rockNames = groups.rock.map((a) => a.name);
    assert.deepEqual(
      rockNames,
      [...rockNames].sort((a, b) => a.localeCompare(b))
    );
    assert.ok(groups.metal.some((a) => a.id === "james-hetfield"));
  });
});
