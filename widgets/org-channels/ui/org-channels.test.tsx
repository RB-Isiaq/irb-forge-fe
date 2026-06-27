import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { OrgChannels } from "./org-channels";
import { useChannelMessages, useChannels } from "@/entities/channel";
import { useMyRole } from "@/entities/member";

const channels = [
  {
    id: "1",
    organizationId: "o1",
    name: "general",
    isDefault: true,
    createdById: null,
    createdAt: "2026-01-01",
    updatedAt: "2026-01-01",
  },
  {
    id: "2",
    organizationId: "o1",
    name: "random",
    isDefault: false,
    createdById: "u1",
    createdAt: "2026-01-02",
    updatedAt: "2026-01-02",
  },
];

const refetch = vi.fn();
const fetchNextPage = vi.fn();

vi.mock("@/entities/channel", () => ({
  useChannels: vi.fn(),
  useChannelMessages: vi.fn(),
  useDeleteChannel: () => ({ mutate: vi.fn(), isPending: false }),
  useSendChannelMessage: () => ({ mutate: vi.fn(), isPending: false }),
  useChannelMembers: () => ({ isLoading: false, data: [] }),
  useAddChannelMember: () => ({ mutate: vi.fn(), isPending: false }),
  useRemoveChannelMember: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/entities/member", () => ({
  useMyRole: vi.fn(),
  useMembers: () => ({
    isLoading: false,
    data: { items: [], total: 0, page: 1, limit: 20, pages: 0 },
  }),
}));

vi.mock("@/entities/user", () => ({
  useAuth: () => ({ user: { id: "u-test" } }),
}));

vi.mock("@/entities/subscription", () => ({
  useOrgSubscription: () => ({ data: { plan: "pro", status: "active" } }),
}));

type UseChannelsResult = ReturnType<typeof useChannels>;
type UseChannelMessagesResult = ReturnType<typeof useChannelMessages>;

function mockMessages(overrides: Partial<UseChannelMessagesResult> = {}) {
  vi.mocked(useChannelMessages).mockReturnValue({
    isLoading: false,
    isError: false,
    data: { pages: [{ items: [], nextCursor: null }], pageParams: [undefined] },
    fetchNextPage,
    hasNextPage: false,
    isFetchingNextPage: false,
    ...overrides,
  } as unknown as UseChannelMessagesResult);
}

describe("OrgChannels", () => {
  beforeEach(() => {
    refetch.mockClear();
    fetchNextPage.mockClear();
    vi.mocked(useMyRole).mockReturnValue("owner");
    vi.mocked(useChannels).mockReturnValue({
      isLoading: false,
      isError: false,
      data: channels,
      refetch,
    } as unknown as UseChannelsResult);
    mockMessages();
  });

  it("puts the deletable channel's delete icon under a `group` ancestor, so group-hover can reveal it", () => {
    render(<OrgChannels slug="acme" />);
    const randomChannelButton = screen.getByRole("button", { name: /random/i });
    // The Trash2 icon relies on `group-hover:opacity-100` — without a `group` class on
    // this button, the icon would stay invisible (opacity-0) forever, regardless of hover.
    expect(randomChannelButton.className).toMatch(/\bgroup\b/);
  });

  it("does not show a delete control on the default channel", () => {
    render(<OrgChannels slug="acme" />);
    const generalChannelButton = screen.getByRole("button", { name: /general/i });
    expect(generalChannelButton.querySelector("svg.lucide-trash-2")).toBeNull();
  });

  it("shows a retry control instead of an empty list when the channel fetch fails", async () => {
    vi.mocked(useChannels).mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      refetch,
    } as unknown as UseChannelsResult);
    render(<OrgChannels slug="acme" />);

    expect(screen.getByText(/couldn't load channels/i)).toBeInTheDocument();
    screen.getByRole("button", { name: /try again/i }).click();
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("offers member management on a non-default channel to an owner, but not on the default channel", () => {
    render(<OrgChannels slug="acme" />);

    // Selecting the non-default "random" channel.
    fireEvent.click(screen.getByRole("button", { name: /random/i }));
    expect(screen.getByRole("button", { name: /manage members/i })).toBeInTheDocument();

    // Switching back to the default "general" channel hides it — the backend's
    // membership for the default channel is managed by org membership, not this UI.
    fireEvent.click(screen.getByRole("button", { name: /general/i }));
    expect(screen.queryByRole("button", { name: /manage members/i })).toBeNull();
  });

  it("hides member management from a plain member, even on a non-default channel", () => {
    vi.mocked(useMyRole).mockReturnValue("member");
    render(<OrgChannels slug="acme" />);

    fireEvent.click(screen.getByRole("button", { name: /random/i }));
    expect(screen.queryByRole("button", { name: /manage members/i })).toBeNull();
  });

  it("loads older messages once the feed is scrolled near the top", () => {
    mockMessages({ hasNextPage: true, isFetchingNextPage: false });
    render(<OrgChannels slug="acme" />);

    const scrollable = document.querySelector(".overflow-y-auto") as HTMLDivElement;
    Object.defineProperty(scrollable, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(scrollable, "clientHeight", { value: 400, configurable: true });
    fireEvent.scroll(scrollable, { target: { scrollTop: 10 } });

    expect(fetchNextPage).toHaveBeenCalledTimes(1);
  });

  it("does not request another page when already fetching one, even if scrolled to the top", () => {
    mockMessages({ hasNextPage: true, isFetchingNextPage: true });
    render(<OrgChannels slug="acme" />);

    const scrollable = document.querySelector(".overflow-y-auto") as HTMLDivElement;
    Object.defineProperty(scrollable, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(scrollable, "clientHeight", { value: 400, configurable: true });
    fireEvent.scroll(scrollable, { target: { scrollTop: 0 } });

    expect(fetchNextPage).not.toHaveBeenCalled();
  });
});
