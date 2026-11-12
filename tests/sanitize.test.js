import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { escapeHtml } from "../js/sanitize.js";

describe("escapeHtml", () => {
  it("escapes HTML special characters", () => {
    assert.equal(
      escapeHtml('<img src="x" onerror="alert(1)">&'),
      "&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;&amp;"
    );
  });

  it("stringifies non-strings safely", () => {
    assert.equal(escapeHtml(null), "null");
    assert.equal(escapeHtml(42), "42");
  });
});
