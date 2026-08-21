/** Signal Desk design note: registry tests protect the disciplined tool taxonomy that makes the workbench coherent. */
import { describe, expect, it } from "vitest";
import { categories, readyToolIds, tools } from "./registry";

describe("DeveloperHub tool registry", () => {
  it("gives every tool a unique id and a declared category", () => {
    const ids = tools.map((tool) => tool.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(tools.every((tool) => categories.some((category) => category.name === tool.category))).toBe(true);
  });

  it("keeps local-first ready tools aligned with their published status", () => {
    expect(tools.filter((tool) => tool.status === "Ready").map((tool) => tool.id).sort()).toEqual([...readyToolIds].sort());
    expect(tools.every((tool) => tool.local)).toBe(true);
  });
});
