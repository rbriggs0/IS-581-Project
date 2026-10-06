import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { STYLES } from "../js/match.js";
import { readJson, root } from "./helpers.js";

const gear = readJson("data/gear.json");
const extras = readJson("data/gear-extras.json");
const artists = readJson("data/artists.json");
const gearIds = new Set(gear.map((item) => item.id));

const TYPES = ["electric", "acoustic"];
const LEVELS = ["beginner", "intermediate", "advanced"];
const HANDS = ["right", "left"];
const USES = ["practice", "songwriting", "recording", "live", "travel"];

describe("data/gear.json", () => {
  it("has unique ids", () => {
    assert.equal(gearIds.size, gear.length);
  });

  for (const item of gear) {
    it(`${item.id} has valid core fields`, () => {
      assert.match(item.id, /^[a-z0-9-]+$/);
      assert.ok(item.brand && item.name && item.blurb);
      assert.ok(TYPES.includes(item.type));
      assert.ok(item.styles.length > 0);
      for (const s of item.styles) assert.ok(STYLES.includes(s), s);
      for (const l of item.levels) assert.ok(LEVELS.includes(l), l);
      for (const h of item.hands) assert.ok(HANDS.includes(h), h);
      assert.ok(Number.isFinite(item.approxPrice) && item.approxPrice > 0);
    });
  }
});

describe("data/gear-extras.json", () => {
  for (const item of gear) {
    it(`${item.id} has extras, a photo on disk, and valid uses`, () => {
      const extra = extras[item.id];
      assert.ok(extra, "missing extras entry");
      assert.equal(extra.image, `../images/gear/${item.id}.png`);
      assert.ok(
        existsSync(new URL(`images/gear/${item.id}.png`, root)),
        "image file missing"
      );
      assert.ok(Array.isArray(extra.uses) && extra.uses.length > 0);
      for (const u of extra.uses) assert.ok(USES.includes(u), u);
    });
  }

  it("has no orphan entries", () => {
    for (const id of Object.keys(extras)) assert.ok(gearIds.has(id), id);
  });
});

describe("data/artists.json", () => {
  it("has unique artist ids", () => {
    const artistIds = artists.map((a) => a.id);
    assert.equal(new Set(artistIds).size, artistIds.length);
  });

  for (const artist of artists) {
    it(`${artist.id} only links to real gear`, () => {
      assert.ok(artist.name && artist.reason && artist.sourceNote);
      for (const s of artist.styles) assert.ok(STYLES.includes(s), s);
      for (const id of artist.gearIds) assert.ok(gearIds.has(id), id);
      for (const id of artist.signatureGearIds || []) {
        assert.ok(gearIds.has(id), id);
        assert.ok(artist.gearIds.includes(id), `${id} not in gearIds`);
      }
    });
  }

  it("signatureFor on gear matches the artist's signature list", () => {
    for (const item of gear.filter((g) => g.signatureFor)) {
      for (const artistId of item.signatureFor) {
        const artist = artists.find((a) => a.id === artistId);
        assert.ok(artist, `${artistId} missing`);
        assert.ok((artist.signatureGearIds || []).includes(item.id));
      }
    }
  });
});
