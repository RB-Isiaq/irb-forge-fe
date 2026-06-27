import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ManageChannelMembersPanel } from "./manage-channel-members-panel";
import { useChannelMembers, useAddChannelMember, useRemoveChannelMember } from "@/entities/channel";
import { useMembers } from "@/entities/member";

const channel = {
  id: "c1",
  organizationId: "o1",
  name: "random",
  isDefault: false,
  createdById: "u1",
  createdAt: "2026-01-01",
  updatedAt: "2026-01-01",
};

const addMutate = vi.fn();
const removeMutate = vi.fn();

vi.mock("@/entities/channel", () => ({
  useChannelMembers: vi.fn(),
  useAddChannelMember: vi.fn(),
  useRemoveChannelMember: vi.fn(),
}));

vi.mock("@/entities/member", () => ({
  useMembers: vi.fn(),
}));

vi.mock("@/entities/user", () => ({
  useAuth: () => ({ user: { id: "u-self" } }),
}));

describe("ManageChannelMembersPanel", () => {
  beforeEach(() => {
    addMutate.mockClear();
    removeMutate.mockClear();

    vi.mocked(useChannelMembers).mockReturnValue({
      isLoading: false,
      data: [
        {
          id: "cm1",
          channelId: "c1",
          organizationId: "o1",
          userId: "u-self",
          joinedAt: "2026-01-01",
          user: { id: "u-self", email: "me@acme.com", firstName: "Me", lastName: null },
        },
        {
          id: "cm2",
          channelId: "c1",
          organizationId: "o1",
          userId: "u-other",
          joinedAt: "2026-01-01",
          user: { id: "u-other", email: "other@acme.com", firstName: "Other", lastName: null },
        },
      ],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useMembers).mockReturnValue({
      isLoading: false,
      data: {
        items: [
          {
            id: "m1",
            userId: "u-self",
            organizationId: "o1",
            role: "owner",
            joinedAt: "2026-01-01",
            user: { id: "u-self", email: "me@acme.com", firstName: "Me", lastName: null },
          },
          {
            id: "m2",
            userId: "u-other",
            organizationId: "o1",
            role: "member",
            joinedAt: "2026-01-01",
            user: { id: "u-other", email: "other@acme.com", firstName: "Other", lastName: null },
          },
          {
            id: "m3",
            userId: "u-candidate",
            organizationId: "o1",
            role: "member",
            joinedAt: "2026-01-01",
            user: {
              id: "u-candidate",
              email: "candidate@acme.com",
              firstName: "Candidate",
              lastName: null,
            },
          },
        ],
        total: 3,
        page: 1,
        limit: 20,
        pages: 1,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useAddChannelMember).mockReturnValue({
      mutate: addMutate,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    vi.mocked(useRemoveChannelMember).mockReturnValue({
      mutate: removeMutate,
      isPending: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  it("renders nothing when closed", () => {
    render(
      <ManageChannelMembersPanel
        open={false}
        onOpenChange={() => {}}
        slug="acme"
        channel={channel}
      />
    );
    expect(screen.queryByText(/members/i)).toBeNull();
  });

  it("lists current members, hides self's own remove control, and offers remove for others", () => {
    render(
      <ManageChannelMembersPanel open onOpenChange={() => {}} slug="acme" channel={channel} />
    );

    expect(screen.getByText(/Me \(you\)/)).toBeInTheDocument();
    expect(screen.getByText("Other")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /remove/i })).toHaveLength(1);

    screen.getByRole("button", { name: /remove/i }).click();
    expect(removeMutate).toHaveBeenCalledWith("u-other", expect.anything());
  });

  it("only offers to add org members who aren't already in the channel", () => {
    render(
      <ManageChannelMembersPanel open onOpenChange={() => {}} slug="acme" channel={channel} />
    );

    // u-self and u-other are already channel members — only the candidate should show.
    expect(screen.getByText("Candidate")).toBeInTheDocument();
    const addButtons = screen.getAllByRole("button", { name: /^add$/i });
    expect(addButtons).toHaveLength(1);

    addButtons[0].click();
    expect(addMutate).toHaveBeenCalledWith({ userId: "u-candidate" }, expect.anything());
  });
});
