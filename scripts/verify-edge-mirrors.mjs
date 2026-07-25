#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const mirrorRoots = [
  "Emerson_Empire/supabase/functions/send-consultation-email",
  "Agency_LandingPage/supabase/functions/send-consultation-email",
];

async function listFiles(directory, relativeDirectory = "") {
  const entries = await readdir(directory, { withFileTypes: true });
  entries.sort((left, right) => left.name.localeCompare(right.name, "en"));

  const files = [];
  for (const entry of entries) {
    const relativePath = path.posix.join(relativeDirectory, entry.name);
    const absolutePath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...(await listFiles(absolutePath, relativePath)));
      continue;
    }

    if (!entry.isFile()) {
      throw new Error(
        `Unsupported non-file entry in Edge mirror: ${relativePath}`,
      );
    }

    files.push(relativePath);
  }

  return files;
}

function sha256(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function inventoryDifference(leftFiles, rightFiles) {
  const left = new Set(leftFiles);
  const right = new Set(rightFiles);

  return [
    ...leftFiles
      .filter((file) => !right.has(file))
      .map((file) => `missing from ${mirrorRoots[1]}: ${file}`),
    ...rightFiles
      .filter((file) => !left.has(file))
      .map((file) => `missing from ${mirrorRoots[0]}: ${file}`),
  ];
}

async function verifyMirrors() {
  const absoluteRoots = mirrorRoots.map((root) =>
    path.join(repositoryRoot, ...root.split("/")),
  );
  const [leftFiles, rightFiles] = await Promise.all(
    absoluteRoots.map((root) => listFiles(root)),
  );

  const errors = inventoryDifference(leftFiles, rightFiles);
  const sharedFiles = leftFiles.filter((file) => rightFiles.includes(file));
  const treeHash = createHash("sha256");

  for (const relativePath of sharedFiles) {
    const [leftBytes, rightBytes] = await Promise.all(
      absoluteRoots.map((root) =>
        readFile(path.join(root, ...relativePath.split("/"))),
      ),
    );

    if (!leftBytes.equals(rightBytes)) {
      errors.push(
        [
          `content mismatch: ${relativePath}`,
          `${mirrorRoots[0]} sha256=${sha256(leftBytes)}`,
          `${mirrorRoots[1]} sha256=${sha256(rightBytes)}`,
        ].join("\n  "),
      );
      continue;
    }

    treeHash.update(relativePath);
    treeHash.update("\0");
    treeHash.update(String(leftBytes.length));
    treeHash.update("\0");
    treeHash.update(leftBytes);
    treeHash.update("\0");
  }

  if (errors.length > 0) {
    throw new Error(
      `Edge Function mirrors are not equivalent:\n- ${errors.join("\n- ")}`,
    );
  }

  console.log(
    [
      `Verified ${sharedFiles.length} byte-identical Edge Function mirror files.`,
      `Tree sha256: ${treeHash.digest("hex")}`,
    ].join("\n"),
  );
}

verifyMirrors().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
