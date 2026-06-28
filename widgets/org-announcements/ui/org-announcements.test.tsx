import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrgAnnouncements } from "./org-announcements";
import { useMessages } from "@/entities/message";

const fetchNextPage = vi.fn();

const message = (id: string, content: string) => ({
  id,
  organizationId: "o1",
  authorId: "u1",
  content,
  createdAt: "2026-01-01T00:00:00.000Z",
  updatedAt: "2026-01-01T00:00:00.000Z",
  author: { id: "u1", firstName: "Ada", lastName: "Lovelace" },
});

vi.mock("@/entities/message", () => ({
  useMessages: vi.fn(),
  useSendMessage: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/entities/member", () => ({
  useMyRole: () => "owner",
}));

type UseMessagesResult = ReturnType<typeof useMessages>;

function mockMessages(overrides: Partial<UseMessagesResult> = {}) {
  vi.mocked(useMessages).mockReturnValue({
    isLoading: false,
    isError: false,
    data: {
      pages: [
        {
          items: [message("m1", "Hello"), message("m2", "World")],
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
  } as unknown as UseMessagesResult);
}

describe("OrgAnnouncements", () => {
  beforeEach(() => {
    fetchNextPage.mockClear();
    mockMessages();
  });

  it("shows a Load more control reflecting how many of the total are loaded, and wires it to fetchNextPage", () => {
    render(<OrgAnnouncements slug="acme" />);

    expect(screen.getByText("Showing 2 of 5 announcements")).toBeInTheDocument();
    screen.getByRole("button", { name: /load more/i }).click();
    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("hides the Load more control once every page has been fetched", () => {
    mockMessages({ hasNextPage: false } as Partial<UseMessagesResult>);
    render(<OrgAnnouncements slug="acme" />);

    expect(screen.queryByRole("button", { name: /load more/i })).toBeNull();
  });
});
