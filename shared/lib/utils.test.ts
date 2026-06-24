import { describe, expect, it } from "vitest";
import { getDisplayName, slugify, stripMarkdown } from "./utils";

describe("stripMarkdown", () => {
  it("strips headings", () => {
    expect(stripMarkdown("# Backend Fundamentals")).toBe("Backend Fundamentals");
  });

  it("strips bold and italic emphasis", () => {
    expect(stripMarkdown("**bold** and _italic_ and *also italic*")).toBe(
      "bold and italic and also italic"
    );
  });

  it("strips inline code and links, keeping link text", () => {
    expect(stripMarkdown("see `code` and [docs](https://example.com)")).toBe("see code and docs");
  });

  it("strips blockquote and list markers", () => {
    expect(stripMarkdown("> quoted line")).toBe("quoted line");
    expect(stripMarkdown("- item one")).toBe("item one");
  });

  it("collapses newlines into single spaces", () => {
    expect(stripMarkdown("line one\nline two\n\nline three")).toBe("line one line two line three");
  });
});

describe("slugify", () => {
  it("lowercases and dashes spaces", () => {
    expect(slugify("My Org Name")).toBe("my-org-name");
  });

  it("strips punctuation", () => {
    expect(slugify("Foo & Bar, Inc.")).toBe("foo-bar-inc");
  });
});

describe("getDisplayName", () => {
  it("prefers first/last name when present", () => {
    expect(getDisplayName("Ada", "Lovelace")).toBe("Ada Lovelace");
  });

  it("falls back to email local part when name is missing", () => {
    expect(getDisplayName(null, null, "ada@example.com")).toBe("ada");
  });
});
