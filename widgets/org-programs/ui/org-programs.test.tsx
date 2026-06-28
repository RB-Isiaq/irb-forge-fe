import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrgPrograms } from "./org-programs";
import { usePrograms } from "@/entities/program";

const fetchNextPage = vi.fn();

const program = (id: string, name: string) => ({
  id,
  organizationId: "o1",
  name,
  description: null,
  status: "active" as const,
  startDate: null,
  endDate: null,
  capacity: null,
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
});

vi.mock("@/entities/program", () => ({
  usePrograms: vi.fn(),
  useCreateProgram: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/entities/enrollment", () => ({
  useMyEnrollmentsInOrg: () => ({ data: [] }),
}));

vi.mock("@/entities/member", () => ({
  useMyRole: () => "owner",
}));

type UseProgramsResult = ReturnType<typeof usePrograms>;

function mockPrograms(overrides: Partial<UseProgramsResult> = {}) {
  vi.mocked(usePrograms).mockReturnValue({
    isLoading: false,
    isError: false,
    data: {
      pages: [
        {
          items: [program("p1", "Backend"), program("p2", "Frontend")],
          total: 5,
          page: 1,
          limit: 2,
          pages: 3,
        },
      ],
      pageParams: [1],
    },
    fetchNextPage,
    hasNextPage: true,
    isFetchingNextPage: false,
    ...overrides,
  } as unknown as UseProgramsResult);
}

describe("OrgPrograms", () => {
  beforeEach(() => {
    fetchNextPage.mockClear();
    mockPrograms();
  });

  it("shows a Load more control reflecting how many of the total are loaded, and wires it to fetchNextPage", () => {
    render(<OrgPrograms slug="acme" />);

    expect(screen.getByText("Showing 2 of 5 programs")).toBeInTheDocument();
    screen.getByRole("button", { name: /load more/i }).click();
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("hides the Load more control once every page has been fetched", () => {
    mockPrograms({ hasNextPage: false } as Partial<UseProgramsResult>);
    render(<OrgPrograms slug="acme" />);

    expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();
  });
});
