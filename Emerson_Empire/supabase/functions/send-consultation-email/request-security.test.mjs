import assert from "node:assert/strict";
import test from "node:test";

import {
  isAllowedRequestOrigin,
  sanitizeSubjectLabel,
} from "./request-security.mjs";

test("public intake requires an exact configured browser origin", () => {
  const allowed = new Set([
    "https://theemerson.netlify.app",
    "http://localhost:5173",
  ]);

  assert.equal(
    isAllowedRequestOrigin("https://theemerson.netlify.app", allowed),
    true,
  );
  assert.equal(
    isAllowedRequestOrigin("http://localhost:5173", allowed),
    true,
  );

  for (const origin of [
    null,
    "",
    "https://theemerson.netlify.app.evil.example",
    "https://theemerson.netlify.app/path",
    "https://user@theemerson.netlify.app",
    "javascript:alert(1)",
  ]) {
    assert.equal(isAllowedRequestOrigin(origin, allowed), false, String(origin));
  }
});

test("email subject labels strip line breaks and control characters", () => {
  assert.equal(
    sanitizeSubjectLabel("Agency\r\nBcc: attacker@example.com"),
    "Agency Bcc: attacker@example.com",
  );
  assert.equal(sanitizeSubjectLabel("\u0000\n\t"), "General inquiry");
});
