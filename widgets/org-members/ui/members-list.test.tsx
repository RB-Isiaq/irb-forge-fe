import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MembersList } from "./members-list";
import { useMembers } from "@/entities/member";

const fetchNextPage = vi.fn();

const member = (id: string, name: string) => ({
  id,
  userId: id,
  organizationId: "o1",
  role: "member" as const,
  joinedAt: "2026-01-01",
  user: { id, email: `${name}@acme.com`, firstName: name, lastName: null },
});

vi.mock("@/entities/member", () => ({
  useMembers: vi.fn(),
  useMyMembership: () => ({ data: { userId: "u-self", role: "owner" } }),
  useUpdateMemberRole: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveMember: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/entities/user/ui/avatar", () => ({
  Avatar: () => null,
}));

type UseMembersResult = ReturnType<typeof useMembers>;

function mockMembers(overrides: Partial<UseMembersResult> = {}) {
  vi.mocked(useMembers).mockReturnValue({
    isLoading: false,
    isError: false,
    data: {
      pages: [
        {
          items: [member("u-self", "Self"), member("u1", "Ada")],
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
  } as unknown as UseMembersResult);
}

describe("MembersList", () => {
  beforeEach(() => {
    fetchNextPage.mockClear();
    mockMembers();
  });

  it("shows a Load more control reflecting how many of the total are loaded, and wires it to fetchNextPage", () => {
    render(<MembersList slug="acme" />);

    expect(screen.getByText("Showing 2 of 5 members")).toBeInTheDocument();
    screen.getByRole("button", { name: /load more/i }).click();
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("hides the Load more control once every page has been fetched", () => {
    mockMembers({ hasNextPage: false } as Partial<UseMembersResult>);
    render(<MembersList slug="acme" />);

    expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();
  });
});
