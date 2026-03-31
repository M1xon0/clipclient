/**
 * useVersionLocker - Enforces that only Minecraft 1.21.1 with NeoForge is used.
 * The version and mod loader are locked and cannot be changed by the user.
 */

export const LOCKED_MINECRAFT_VERSION = '1.21.1'
export const LOCKED_MOD_LOADER = 'neoforge'

export interface LockedRuntime {
  minecraft: string
  neoForged?: string
}

export interface ValidationResult {
  valid: boolean
  reason?: string
}

/**
 * Returns true if the given Minecraft version matches the locked version.
 */
export function isVersionLocked(minecraft: string): boolean {
  return minecraft === LOCKED_MINECRAFT_VERSION
}

/**
 * Returns true if the given mod loader identifier is the locked loader (neoforge).
 */
export function isModLoaderLocked(modLoader: string): boolean {
  return modLoader.toLowerCase() === LOCKED_MOD_LOADER
}

/**
 * Returns true when the runtime satisfies both the locked Minecraft version
 * AND has a NeoForge version set.
 */
export function canLaunch(runtime: LockedRuntime): boolean {
  return runtime.minecraft === LOCKED_MINECRAFT_VERSION && !!runtime.neoForged
}

/**
 * Validates a runtime configuration against the lock constraints.
 * Returns { valid: true } when all constraints are satisfied, or
 * { valid: false, reason } describing the first violated constraint.
 */
export function validateInstance(runtime: LockedRuntime): ValidationResult {
  if (runtime.minecraft !== LOCKED_MINECRAFT_VERSION) {
    return {
      valid: false,
      reason: `Minecraft version must be ${LOCKED_MINECRAFT_VERSION}. Got: ${runtime.minecraft}`,
    }
  }
  if (!runtime.neoForged) {
    return {
      valid: false,
      reason: 'NeoForge mod loader is required but not configured.',
    }
  }
  return { valid: true }
}

/**
 * Returns the default locked runtime that should be used for all instances.
 */
export function getLockedRuntime(neoForgedVersion = ''): LockedRuntime {
  return {
    minecraft: LOCKED_MINECRAFT_VERSION,
    neoForged: neoForgedVersion || undefined,
  }
}
