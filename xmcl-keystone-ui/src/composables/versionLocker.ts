import { InjectionKey } from 'vue'
import { useService } from '@/composables'
import { InstanceServiceKey } from '@xmcl/runtime-api'
import { injection } from '@/util/inject'
import { kInstance } from './instance'

export const CLIPCLIENT_MINECRAFT_VERSION = '1.21.1'
export const CLIPCLIENT_NEOFORGE_VERSION_PREFIX = '21.1'

export const kVersionLocker: InjectionKey<ReturnType<typeof useVersionLocker>> = Symbol('VersionLocker')

/**
 * Enforces that instances always use Minecraft 1.21.1 with NeoForge.
 * Prevents users from changing the version or mod loader.
 */
export function useVersionLocker() {
  const { instance } = injection(kInstance)
  const { editInstance } = useService(InstanceServiceKey)

  const lockedMinecraft = CLIPCLIENT_MINECRAFT_VERSION
  const lockedLoader = 'neoForge'

  const isVersionCompliant = computed(() => {
    const runtime = instance.value.runtime
    return (
      runtime.minecraft === CLIPCLIENT_MINECRAFT_VERSION &&
      !!runtime.neoForged &&
      runtime.neoForged.startsWith(CLIPCLIENT_NEOFORGE_VERSION_PREFIX)
    )
  })

  async function enforceVersion() {
    const runtime = instance.value.runtime
    if (!isVersionCompliant.value) {
      await editInstance({
        instancePath: instance.value.path,
        runtime: {
          ...runtime,
          minecraft: CLIPCLIENT_MINECRAFT_VERSION,
          forge: '',
          fabricLoader: '',
          quiltLoader: '',
          optifine: '',
          labyMod: '',
        },
      })
    }
  }

  watch(
    () => instance.value.path,
    () => {
      if (instance.value.path) {
        enforceVersion()
      }
    },
    { immediate: true },
  )

  return {
    /** Version is always locked to Minecraft 1.21.1 + NeoForge in ClipClient */
    isVersionLocked: true,
    isVersionCompliant,
    lockedMinecraft,
    lockedLoader,
    enforceVersion,
  }
}
