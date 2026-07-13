import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const repositoryRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const applications = ['Emerson_Empire', 'Agency_LandingPage', 'EPDG-Landing-Page', 'epdg']

for (const application of applications) {
  const readJson = (file) => JSON.parse(readFileSync(join(repositoryRoot, application, file), 'utf8'))
  const manifest = readJson('package.json')
  const lock = readJson('package-lock.json')
  const lockRoot = lock.packages?.['']

  assert.ok(lockRoot, `${application} lockfile is missing its root package entry`)
  assert.equal(manifest.packageManager, 'npm@11.17.0', `${application} does not pin npm 11.17.0`)
  assert.equal(manifest.engines?.node, '22.23.1', `${application} does not pin Node 22.23.1`)
  assert.equal(manifest.engines?.npm, '11.17.0', `${application} does not pin npm 11.17.0 in engines`)

  for (const group of ['dependencies', 'devDependencies']) {
    for (const [name, specification] of Object.entries(manifest[group] ?? {})) {
      assert.doesNotMatch(
        specification,
        /^(?:[~^*]|file:|git(?:hub)?:|https?:)/,
        `${application} has a non-exact ${group} specification for ${name}`,
      )
      assert.equal(
        lockRoot[group]?.[name],
        specification,
        `${application} package.json and package-lock.json disagree for ${name}`,
      )
    }
  }

  console.log(`${application}: manifest and lockfile parity passed`)
}
