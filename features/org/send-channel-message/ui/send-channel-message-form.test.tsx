import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SendChannelMessageForm } from "./send-channel-message-form";
import { useMediaQuery } from "@/shared/lib/use-media-query";

afterEach(cleanup);

const mutate = vi.fn();
afterEach(() => mutate.mockClear());

vi.mock("@/entities/channel", () => ({
  useSendChannelMessage: () => ({ mutate, isPending: false }),
}));

// Desktop by default; mobile describe overrides via vi.mocked().
vi.mock("@/shared/lib/use-media-query", () => ({
  useMediaQuery: vi.fn().mockReturnValue(true),
}));

describe("SendChannelMessageForm — desktop", () => {
  it("rejects a whitespace-only message instead of submitting an empty trimmed string", async () => {
    const user = userEvent.setup();
    render(<SendChannelMessageForm slug="acme" channelId="c1" />);

    await user.type(screen.getByPlaceholderText(/message this channel/i), "   ");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(mutate).not.toHaveBeenCalled());
  });

  it("shows a live markdown preview when switching to the Preview tab", async () => {
    const user = userEvent.setup();
    render(<SendChannelMessageForm slug="acme" channelId="c1" />);

    await user.type(screen.getByPlaceholderText(/message this channel/i), "**hello**");
    await user.click(screen.getByRole("button", { name: /preview/i }));

    expect(screen.getByText("hello")).toBeInTheDocument();
  });
});

describe("SendChannelMessageForm — mobile", () => {
  beforeEach(() => vi.mocked(useMediaQuery).mockReturnValue(false));
  afterEach(() => vi.mocked(useMediaQuery).mockReturnValue(true));

  it("renders a plain input with emoji and send buttons — no toolbar or preview tab", () => {
    render(<SendChannelMessageForm slug="acme" channelId="c1" />);

    expect(screen.getByPlaceholderText("Message…")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Send message" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add emoji" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /preview/i })).not.toBeInTheDocument();
  });

  it("rejects a whitespace-only message on mobile too", async () => {
    const user = userEvent.setup();
    render(<SendChannelMessageForm slug="acme" channelId="c1" />);

    await user.type(screen.getByPlaceholderText("Message…"), "   ");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    await waitFor(() => expect(mutate).not.toHaveBeenCalled());
  });
});
