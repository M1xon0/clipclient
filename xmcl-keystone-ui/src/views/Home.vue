<template>
  <div
    ref="scrollElement"
    class="clipclient-home select-none flex h-full w-full overflow-hidden"
  >
    <HomeCriticalError />

    <!-- Left Panel: Login -->
    <div class="login-panel flex-none w-[340px] flex flex-col">
      <LoginScreen />
    </div>

    <!-- Divider -->
    <div class="panel-divider w-px bg-white bg-opacity-10 flex-none self-stretch" />

    <!-- Right Panel: Game -->
    <div class="game-panel-wrapper flex-1 flex flex-col">
      <GamePanel />
    </div>

    <!-- Dialogs (preserved from original) -->
    <HomeLogDialog />
    <HomeDropModpackDialog />
    <HomeLaunchMultiInstanceDialog />
    <HomeLaunchStatusDialog />
    <HomeInstanceInstallDialog />
    <AppCollectionDialog />
  </div>
</template>

<script lang="ts" setup>
import { useDialog } from '@/composables/dialog'
import { useGlobalDrop } from '@/composables/dropHandler'
import { kInstance } from '@/composables/instance'
import { kModsManager, useModsManager } from '@/composables/modsManager'
import { kVersionLocker, useVersionLocker } from '@/composables/versionLocker'
import { injection } from '@/util/inject'
import GamePanel from '@/components/GamePanel.vue'
import LoginScreen from '@/components/LoginScreen.vue'
import HomeCriticalError from './HomeCriticalError.vue'
import AppCollectionDialog from './AppCollectionDialog.vue'
import HomeDropModpackDialog from './HomeDropModpackDialog.vue'
import HomeInstanceInstallDialog from './HomeInstanceInstallDialog.vue'
import HomeLaunchMultiInstanceDialog from './HomeLaunchMultiInstanceDialog.vue'
import HomeLaunchStatusDialog from './HomeLaunchStatusDialog.vue'
import HomeLogDialog from './HomeLogDialog.vue'

// Provide version locking and mods manager to child components
const versionLocker = useVersionLocker()
provide(kVersionLocker, versionLocker)

const modsManager = useModsManager()
provide(kModsManager, modsManager)

const { show } = useDialog('HomeDropModpackDialog')

useGlobalDrop({
  onDrop: async (e) => {
    const files = e.files
    const file = files?.[0]
    if (file) {
      const ext = file.name.split('.').pop()
      if (ext === 'zip' || ext === 'mrpack') {
        show(file.path)
        return
      }
    }
  },
})

const scrollElement = ref(null as HTMLElement | null)
provide('scrollElement', scrollElement)
</script>

<style scoped>
.clipclient-home {
  background: transparent;
  min-height: 0;
}

.login-panel {
  min-height: 0;
}

.game-panel-wrapper {
  min-height: 0;
}
</style>
