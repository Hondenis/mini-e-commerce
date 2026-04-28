/**
 * Safe localStorage helpers with versioning. All app keys are namespaced.
 * Keys are versioned so a future schema change can invalidate old data.
 */

const PREFIX = 'atelier:v1:'
const PREFIX = 'hs-store:v1:'

export function storageKey(name: string) {
  return `${PREFIX}${name}`
}

export function readJson<T>(name: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(storageKey(name))
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

export function writeJson<T>(name: string, value: T): void {
  try {
    localStorage.setItem(storageKey(name), JSON.stringify(value))
  } catch {
    /* quota / disabled — fail silently */
  }
}

export function removeKey(name: string): void {
  try {
    localStorage.removeItem(storageKey(name))
  } catch {
    /* noop */
  }
}
