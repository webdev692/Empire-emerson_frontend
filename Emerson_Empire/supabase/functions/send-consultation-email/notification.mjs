/**
 * Run a notification side effect without converting an already-stored lead
 * into a failed submission. The caller controls privacy-safe logging.
 *
 * @param {() => Promise<unknown>} action
 * @param {(error: unknown) => void} onFailure
 * @returns {Promise<boolean>}
 */
export async function attemptNotification(action, onFailure) {
  try {
    await action()
    return true
  } catch (error) {
    onFailure(error)
    return false
  }
}
