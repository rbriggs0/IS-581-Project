import { readFileSync } from "node:fs";
import { mergeGearExtras } from "../js/match.js";

const root = new URL("../", import.meta.url);

export function readJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, root), "utf8"));
}

export function loadCatalog() {
  const gear = readJson("data/gear.json");
  const extras = readJson("data/gear-extras.json");
  return mergeGearExtras(gear, extras);
}

export function loadArtistData() {
  return readJson("data/artists.json");
}

export { root };
