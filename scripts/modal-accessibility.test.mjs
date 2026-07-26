import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (path) => readFileSync(path, "utf8");

const agencyModal = read(
  "Agency_LandingPage/src/Components/Umbrella/RequestFormModal.tsx",
);
const epdgModal = read(
  "EPDG-Landing-Page/src/components/EPDG/FormModal.tsx",
);

test("Agency cross-origin form keeps keyboard focus in the parent dialog", () => {
  assert.match(agencyModal, /openFormLinkRef/);
  assert.match(agencyModal, /Open form in new tab/);
  assert.match(agencyModal, /tabIndex=\{-1\}/);
  assert.match(agencyModal, /aria-hidden="true"/);
  assert.doesNotMatch(agencyModal, /iframeRef/);
});

test("EPDG cross-origin forms provide the same keyboard-safe fallback", () => {
  assert.match(epdgModal, /openFormLinkRef/);
  assert.match(epdgModal, /Open form in new tab/);
  assert.match(epdgModal, /tabIndex=\{-1\}/);
  assert.match(epdgModal, /aria-hidden="true"/);
  assert.doesNotMatch(epdgModal, /iframeRef/);
  assert.doesNotMatch(epdgModal, /loadCount|Submitted Successfully|Submitted!/);
});

test("unpublished legal destinations are not exposed as hash-only links", () => {
  const sources = [
    read("Agency_LandingPage/src/Components/Umbrella/Navbar.tsx"),
    read("Agency_LandingPage/src/Components/Umbrella/Footer.tsx"),
    read("EPDG-Landing-Page/src/components/EPDG/EPDGFooter.tsx"),
  ];

  for (const source of sources) {
    assert.doesNotMatch(source, /href=["']#["']/);
  }
});
