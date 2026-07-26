import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const classDataUrl = new URL(
  "../shared/class-catalog.ts",
  import.meta.url,
);
const empireClassDataUrl = new URL(
  "../Emerson_Empire/src/Components/data/classData.ts",
  import.meta.url,
);
const landingClassDataUrl = new URL(
  "../EPDG-Landing-Page/src/components/EPDG/classData.ts",
  import.meta.url,
);
const classSearchUrl = new URL(
  "../Emerson_Empire/src/Components/Umbrella/ClassSearch.tsx",
  import.meta.url,
);
const weeklyClassesUrl = new URL(
  "../EPDG-Landing-Page/src/components/EPDG/WeeklyClasses.tsx",
  import.meta.url,
);
const landingPageUrl = new URL(
  "../EPDG-Landing-Page/src/components/EPDG/LandingPage.tsx",
  import.meta.url,
);
const classesPageUrl = new URL(
  "../EPDG-Landing-Page/src/components/EPDG/ClassesPage.tsx",
  import.meta.url,
);

const [
  classData,
  empireClassData,
  landingClassData,
  classSearch,
  weeklyClasses,
  landingPage,
  classesPage,
] = await Promise.all([
  readFile(classDataUrl, "utf8"),
  readFile(empireClassDataUrl, "utf8"),
  readFile(landingClassDataUrl, "utf8"),
  readFile(classSearchUrl, "utf8"),
  readFile(weeklyClassesUrl, "utf8"),
  readFile(landingPageUrl, "utf8"),
  readFile(classesPageUrl, "utf8"),
]);

test("both public class experiences use the same reviewed catalog", () => {
  for (const entrypoint of [empireClassData, landingClassData]) {
    assert.match(entrypoint, /export \{ classes \} from "\.\.\/\.\.\/\.\.\/\.\.\/shared\/class-catalog"/);
    assert.match(entrypoint, /export type \{ ClassItem \} from "\.\.\/\.\.\/\.\.\/\.\.\/shared\/class-catalog"/);
  }
});

test("the three daily class tiers retain their exact time, price, and duration", () => {
  const expectedTierFragments = [
    [
      "free",
      "time: '10:00 AM EDT'",
      "durationMinutes: 60",
      "price: 0",
    ],
    [
      "workshop",
      "time: '2:00 PM EDT'",
      "durationMinutes: 90",
      "price: 10",
    ],
    [
      "intensive",
      "time: '7:00 PM EDT'",
      "durationMinutes: 120",
      "price: 20",
    ],
  ];

  for (const [tier, time, duration, price] of expectedTierFragments) {
    const start = classData.indexOf(`  ${tier}: {`);
    const end = classData.indexOf("\n  },", start);
    assert.notEqual(start, -1, `${tier} tier must exist`);
    const block = classData.slice(start, end);
    assert.ok(block.includes(time), `${tier} time changed`);
    assert.ok(block.includes(duration), `${tier} duration changed`);
    assert.ok(block.includes(price), `${tier} price changed`);
  }
});

test("the schedule remains Monday through Sunday with three tiers per day", () => {
  const entries = [
    ...classData.matchAll(
      /makeClass\(\s*\d+,\s*'(free|workshop|intensive)',\s*'(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)'/g,
    ),
  ].map((match) => ({ tier: match[1], day: match[2] }));

  assert.equal(entries.length, 21, "the schedule must contain exactly 21 classes");

  for (const day of [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]) {
    assert.deepEqual(
      entries.filter((entry) => entry.day === day).map((entry) => entry.tier),
      ["free", "workshop", "intensive"],
      `${day} must retain the free, workshop, and intensive sequence`,
    );
  }
});

test("local paid-class UIs retain a fee-waiver path without a document-upload field", () => {
  assert.match(classSearch, /const isPaid = item\.price > 0/);
  assert.match(classSearch, /\{isPaid && \(\s*<a[\s\S]*?href=\{FEE_WAIVER_URL\}/);

  const paidGateStart = weeklyClasses.indexOf("{classItem.price > 0 && (");
  const paidGateEnd = weeklyClasses.indexOf("\n                  )}", paidGateStart);
  assert.notEqual(paidGateStart, -1, "the active EPDG paid-class gate must exist");
  assert.notEqual(paidGateEnd, -1, "the active EPDG paid-class gate must close locally");
  const paidGate = weeklyClasses.slice(paidGateStart, paidGateEnd);
  assert.match(paidGate, /<button[\s\S]*?openForm\(FORM_FEE_WAIVER,[\s\S]*?<\/button>/);
  assert.doesNotMatch(paidGate, /FORM_CLASSES/);

  assert.match(
    classSearch,
    /does not ask for sensitive documents/,
    "the Empire privacy assurance must remain visible",
  );
  assert.match(
    weeklyClasses,
    /does not ask for sensitive\s+documents/,
    "the EPDG landing privacy assurance must remain visible",
  );
  assert.doesNotMatch(classSearch, /type=["']file["']/i);
  assert.doesNotMatch(weeklyClasses, /type=["']file["']/i);
});

test("EPDG landing and classes routes retain their main landmark and skip link", () => {
  for (const page of [landingPage, classesPage]) {
    assert.match(page, /href="#main-content"/);
    assert.match(page, /<main id="main-content">/);
  }
  assert.match(weeklyClasses, /<h1[\s\S]*?id="classes-title"/);
});
