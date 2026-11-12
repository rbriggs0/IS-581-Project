import { expect, test } from "@playwright/test";

test.describe("quiz → results", () => {
  test("happy path shows match cards with Popular below the grid", async ({
    page,
  }) => {
    await page.goto("/pages/quiz.html");

    await page.locator('input[name="style"][value="rock"]').check();
    await page.locator('input[name="type"][value="acoustic"]').check();
    await page.locator('input[name="level"][value="either"]').check();
    await page.locator('input[name="hand"][value="either"]').check();
    await page.locator('input[name="use"][value="either"]').check();
    await page.locator("#budgetMax").fill("800");

    await page.getByRole("button", { name: "See my matches" }).click();
    await expect(page).toHaveURL(/pages\/results\.html/);

    const list = page.locator("#results-list");
    const rail = page.locator("#popular-rail");
    await expect(list.locator(".result-card").first()).toBeVisible();
    await expect(rail).toBeVisible();
    await expect(rail.getByRole("heading", { level: 2 })).toContainText(
      /Popular in/i
    );

    const listBox = await list.boundingBox();
    const railBox = await rail.boundingBox();
    expect(listBox).toBeTruthy();
    expect(railBox).toBeTruthy();
    expect(railBox.y).toBeGreaterThanOrEqual(listBox.y + listBox.height - 2);
  });

  test("odd query params do not inject raw HTML into the DOM", async ({
    page,
  }) => {
    const payload = '<img src="x" onerror="alert(1)">';
    const url =
      "/pages/results.html?style=rock&type=acoustic&level=either&hand=either&use=either&budgetMin=0&budgetMax=800&artist=" +
      encodeURIComponent(payload);

    await page.goto(url);
    await expect(page.locator("#results-status")).not.toHaveText(
      /Loading matches/i
    );

    await expect(page.locator('img[src="x"]')).toHaveCount(0);
    await expect(page.locator("img[onerror]")).toHaveCount(0);

    const bodyHtml = await page.locator("body").innerHTML();
    expect(bodyHtml).not.toContain('onerror="alert(1)"');
    expect(bodyHtml).not.toContain('<img src="x"');
  });

  test("security meta tags are present on quiz and home", async ({ page }) => {
    for (const path of ["/", "/pages/quiz.html"]) {
      await page.goto(path);
      const csp = page.locator('meta[http-equiv="Content-Security-Policy"]');
      await expect(csp).toHaveCount(1);
      const content = await csp.getAttribute("content");
      expect(content || "").toMatch(/default-src\s+'self'/i);
      await expect(page.locator('meta[name="referrer"]')).toHaveAttribute(
        "content",
        /strict-origin-when-cross-origin|no-referrer/
      );
      await expect(
        page.locator('meta[http-equiv="Permissions-Policy"]')
      ).toHaveCount(1);
    }
  });
});
