import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { OrgChannels } from "./org-channels";
import { useChannels } from "@/entities/channel";

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

vi.mock("@/entities/channel", () => ({
  useChannels: vi.fn(),
  useChannelMessages: () => ({
    isLoading: false,
    data: { items: [], total: 0, page: 1, limit: 20, pages: 0 },
  }),
  useDeleteChannel: () => ({ mutate: vi.fn(), isPending: false }),
  useSendChannelMessage: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock("@/entities/member", () => ({
  useMyRole: () => "owner",
}));

vi.mock("@/entities/subscription", () => ({
  useOrgSubscription: () => ({ data: { plan: "pro", status: "active" } }),
}));

type UseChannelsResult = ReturnType<typeof useChannels>;

describe("OrgChannels", () => {
  beforeEach(() => {
    refetch.mockClear();
    vi.mocked(useChannels).mockReturnValue({
      isLoading: false,
      isError: false,
      data: channels,
      refetch,
    } as unknown as UseChannelsResult);
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
});
