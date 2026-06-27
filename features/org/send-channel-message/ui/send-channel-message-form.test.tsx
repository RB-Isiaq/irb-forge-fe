import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SendChannelMessageForm } from "./send-channel-message-form";

const mutate = vi.fn();

vi.mock("@/entities/channel", () => ({
  useSendChannelMessage: () => ({ mutate, isPending: false }),
}));

describe("SendChannelMessageForm", () => {
  it("rejects a whitespace-only message instead of submitting an empty trimmed string", async () => {
    const user = userEvent.setup();
    render(<SendChannelMessageForm slug="acme" channelId="c1" />);

    await user.type(screen.getByPlaceholderText(/message this channel/i), "   ");
    await user.click(screen.getByRole("button", { name: "Send message" }));

    // `.trim()` must run before `.min(1)` — otherwise a whitespace-only string
    // passes length validation and is then trimmed to "" before submission.
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
