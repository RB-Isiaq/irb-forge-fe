import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MyEnrollments } from "./my-enrollments";

vi.mock("@/entities/enrollment", () => ({
  useMyEnrollmentsInOrg: () => ({
    isLoading: false,
    data: [
      {
        id: "1",
        programId: "p1",
        status: "active",
        enrolledAt: "2026-01-01",
        completedAt: null,
        program: { name: "Backend Fundamentals" },
      },
      {
        id: "2",
        programId: "p2",
        status: "completed",
        enrolledAt: "2025-01-01",
        completedAt: "2025-06-01",
        program: { name: "System Design" },
      },
    ],
  }),
}));

describe("MyEnrollments", () => {
  it("renders each enrollment row as a block-level link, so the list's space-y gap actually applies", () => {
    render(<MyEnrollments slug="acme" />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(2);
    // next/link renders an <a>, which defaults to display:inline — without an explicit
    // `block` class, the parent's space-y-* margin between rows is silently ignored by
    // the browser (vertical margins have no effect on inline boxes).
    for (const link of links) {
      expect(link.className).toMatch(/\bblock\b/);
    }
  });
});
