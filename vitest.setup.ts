import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

// RTL's own afterEach auto-cleanup only registers when it detects a *global* afterEach
// (vitest.config.ts intentionally doesn't set `test.globals`, see CLAUDE.md's Testing
// section), so without this, multiple `render()` calls across tests in the same file
// leak into the same document and queries silently match stale, duplicated DOM.
afterEach(cleanup);
