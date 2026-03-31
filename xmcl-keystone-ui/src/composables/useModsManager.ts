/**
 * useModsManager - Read-only mods management with automatic synchronisation.
 *
 * Mods CANNOT be added, removed or edited by the user.
 * They are synchronised automatically from the M1xon0/modyclip repository.
 */

export interface ModEntry {
  id: string
  name: string
  version: string
  filename: string
  url: string
  required: boolean
}

export interface SyncResult {
  added: ModEntry[]
  removed: string[]
  updated: ModEntry[]
  unchanged: number
}

/** Repository URL for automatic mod updates */
export const MODS_REPO_URL = 'https://api.github.com/repos/M1xon0/modyclip/contents/mods'

/** Mods are always read-only for the user */
export const MOD_READ_ONLY = true

/**
 * Returns whether the user is allowed to add a mod.
 * Always false – mods are managed automatically.
 */
export function canAddMod(): boolean {
  return false
}

/**
 * Returns whether the user is allowed to remove a mod.
 * Always false – mods are managed automatically.
 */
export function canRemoveMod(): boolean {
  return false
}

/**
 * Returns whether the user is allowed to edit mod settings.
 * Always false – mods are managed automatically.
 */
export function canEditMod(): boolean {
  return false
}

/**
 * Detects changes between the local mod list and the remote list.
 * Returns a SyncResult describing what needs to be updated.
 */
export function detectChanges(local: ModEntry[], remote: ModEntry[]): SyncResult {
  const localMap = new Map(local.map(m => [m.id, m]))
  const remoteMap = new Map(remote.map(m => [m.id, m]))

  const added: ModEntry[] = []
  const updated: ModEntry[] = []
  const removed: string[] = []
  let unchanged = 0

  for (const remote of remoteMap.values()) {
    const existing = localMap.get(remote.id)
    if (!existing) {
      added.push(remote)
    } else if (existing.version !== remote.version) {
      updated.push(remote)
    } else {
      unchanged++
    }
  }

  for (const local of localMap.values()) {
    if (!remoteMap.has(local.id)) {
      removed.push(local.id)
    }
  }

  return { added, removed, updated, unchanged }
}

/**
 * Determines whether a sync is needed based on detected changes.
 */
export function needsSync(result: SyncResult): boolean {
  return result.added.length > 0 || result.removed.length > 0 || result.updated.length > 0
}

/**
 * useModsManager composable – provides reactive state and helpers for the
 * read-only mods panel.
 */
export function useModsManager() {
  return {
    isReadOnly: MOD_READ_ONLY,
    repoUrl: MODS_REPO_URL,
    canAddMod,
    canRemoveMod,
    canEditMod,
    detectChanges,
    needsSync,
  }
}
