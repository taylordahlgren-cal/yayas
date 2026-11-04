import { describe, it, expect } from "vitest";
import { computeStats } from "@/lib/stats";

// PLAN.md test #2:
// Given a user has logged 3 outings with dog ratings 5, 4 and 3,
// when the dashboard stats are calculated,
// then the average dog rating is 4.0 and the total outing count is 3.
describe("Dashboard stats", () => {
  const outings = [
    { date: "2026-11-02", miles: 2.5, minutes: 50, dog_rating: 5, places: { name: "Point Isabel" } },
    { date: "2026-11-01", miles: 1.0, minutes: 25, dog_rating: 4, places: { name: "Point Isabel" } },
    { date: "2026-10-27", miles: 3.0, minutes: 70, dog_rating: 3, places: { name: "Tilden Park" } },
  ];

  it("calculates the average dog rating and outing count", () => {
    const s = computeStats(outings, { today: "2026-11-03" });
    expect(s.count).toBe(3);
    expect(s.avgRating).toBe(4.0);
  });

  it("adds up miles and picks the most-visited favorite spot", () => {
    const s = computeStats(outings, { today: "2026-11-03" });
    expect(s.totalMiles).toBe(6.5);
    expect(s.favorite.name).toBe("Point Isabel");
  });

  it("shows zeros (not NaN) when there are no outings yet", () => {
    const s = computeStats([], { today: "2026-11-03" });
    expect(s.count).toBe(0);
    expect(s.avgRating).toBe(0);
  });
});
