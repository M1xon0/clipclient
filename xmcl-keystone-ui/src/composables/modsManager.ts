import { InjectionKey } from 'vue'
import { injection } from '@/util/inject'
import { kInstanceModsContext } from './instanceMods'

export const MODYCLIP_MODS_URL = 'https://raw.githubusercontent.com/M1xon0/modyclip/main/mods.json'
export const MODS_SYNC_INTERVAL_MS = 30 * 60 * 1000

export interface ClipMod {
  id: string
  name: string
  version: string
  fileName: string
  downloadUrl: string
  description?: string
}

export const kModsManager: InjectionKey<ReturnType<typeof useModsManager>> = Symbol('ModsManager')

/**
 * Read-only mods manager that syncs mods from the M1xon0/modyclip repository.
 * Users cannot add, remove, or edit mods — they are managed centrally.
 */
export function useModsManager() {
  const { enabledMods } = injection(kInstanceModsContext)

  const remoteMods = ref<ClipMod[]>([])
  const isSyncing = ref(false)
  const syncError = ref<string | undefined>(undefined)
  const lastSyncedAt = ref<Date | undefined>(undefined)

  async function fetchRemoteMods(): Promise<ClipMod[]> {
    const resp = await fetch(MODYCLIP_MODS_URL, { cache: 'no-cache' })
    if (!resp.ok) {
      throw new Error(`Failed to fetch mods list: ${resp.status} ${resp.statusText}`)
    }
    const data = await resp.json()
    return Array.isArray(data) ? data : []
  }

  async function syncMods() {
    if (isSyncing.value) return
    isSyncing.value = true
    syncError.value = undefined
    try {
      remoteMods.value = await fetchRemoteMods()
      lastSyncedAt.value = new Date()
    } catch (e: any) {
      syncError.value = e?.message ?? 'Unknown error'
    } finally {
      isSyncing.value = false
    }
  }

  // Sync on mount, and every 30 minutes
  onMounted(() => {
    syncMods()
    const timer = setInterval(syncMods, MODS_SYNC_INTERVAL_MS)
    onUnmounted(() => clearInterval(timer))
  })

  return {
    /** Mods fetched from M1xon0/modyclip repo (read-only list) */
    remoteMods,
    /** Currently installed mods in this instance */
    installedMods: enabledMods,
    isSyncing,
    syncError,
    lastSyncedAt,
    syncMods,
  }
}
