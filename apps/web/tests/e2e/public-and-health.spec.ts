import { expect, test } from "@playwright/test";

test.describe("public StoryTime surface", () => {
  test("shows the public value proposition and demo entry point", async ({ page }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", {
        level: 1,
        name: "StoryTime turns family calls into replayable adventures.",
      }),
    ).toBeVisible();
    await expect(page.getByRole("link", { name: "Open MVP demo" })).toHaveAttribute(
      "href",
      "/demo",
    );
    await expect(
      page.getByText("Adult-controlled consent and handoff", { exact: true }),
    ).toBeVisible();
  });

  test("reports synthetic application health without credentials", async ({ request }) => {
    const response = await request.get("/api/health");

    expect(response.ok()).toBe(true);
    expect(response.headers()["content-type"]).toContain("application/json");
    expect(await response.json()).toMatchObject({
      ok: true,
      app: "StoryTime",
      phase: "mvp",
    });
  });

  test("walks through protected demo controls and passes the story baton", async ({ page }) => {
    await page.goto("/demo");

    await expect(
      page.getByRole("heading", { level: 1, name: "Follow the trust boundary, step by step." }),
    ).toBeVisible();
    await page.getByRole("button", { name: /^Next/ }).click();
    await expect(page.getByRole("heading", { name: "Dad is waiting for Rania" })).toBeVisible();

    await page.getByRole("button", { name: "07 Story room" }).click();
    await expect(page.getByText("Rania's turn next")).toBeVisible();
    await page.getByRole("button", { name: /Pass the story baton/ }).click();
    await expect(page.getByText("Dad's turn next")).toBeVisible();
  });
});
