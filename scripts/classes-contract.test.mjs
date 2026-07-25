import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const classDataUrl = new URL(
  "../Emerson_Empire/src/Components/data/classData.ts",
  import.meta.url,
);
const classSearchUrl = new URL(
  "../Emerson_Empire/src/Components/Umbrella/ClassSearch.tsx",
  import.meta.url,
);

const [classData, classSearch] = await Promise.all([
  readFile(classDataUrl, "utf8"),
  readFile(classSearchUrl, "utf8"),
]);

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

test("paid class cards retain a fee-waiver path without a document-upload request", () => {
  assert.match(classSearch, /const isPaid = item\.price > 0/);
  assert.match(classSearch, /\{isPaid && \(\s*<a[\s\S]*?href=\{FEE_WAIVER_URL\}/);
  assert.match(
    classSearch,
    /does not ask for sensitive documents/,
    "the plain-language privacy assurance must remain visible",
  );
  assert.doesNotMatch(classSearch, /type=["']file["']/i);
});
