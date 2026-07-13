export function resolveDeploymentBase(value: string | undefined): string {
  const base = value?.trim()

  if (!base) return '/'

  if (!base.startsWith('/') || !base.endsWith('/')) {
    throw new Error('DEPLOY_BASE_PATH must start and end with a forward slash.')
  }

  return base
}
