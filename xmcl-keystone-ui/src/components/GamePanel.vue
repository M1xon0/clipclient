<template>
  <div class="game-panel flex flex-col items-center justify-between h-full px-8 py-10">
    <!-- Logo / Branding -->
    <div class="branding flex flex-col items-center gap-3">
      <div class="logo-text">
        <span class="clip">Clip</span><span class="client">Client</span>
      </div>
      <div class="tagline text-gray-400 text-sm tracking-widest uppercase">
        Minecraft 1.21.1 · NeoForge
      </div>
    </div>

    <!-- Main Actions -->
    <div class="actions flex flex-col gap-4 w-full max-w-xs">
      <!-- GRAJ (Play) Button -->
      <v-btn
        id="launch-button"
        block
        x-large
        :color="launchColor"
        :loading="launchLoading"
        :disabled="launchLoading"
        class="play-btn text-white text-lg font-bold tracking-wide shadow-lg"
        @click="onLaunch"
      >
        <v-icon
          v-if="launchLeftIcon"
          left
          class="text-2xl"
        >
          {{ launchLeftIcon }}
        </v-icon>
        {{ launchText }}
        <v-icon
          v-if="!launchLoading && launchIcon"
          right
          class="text-2xl"
        >
          {{ launchIcon }}
        </v-icon>
      </v-btn>

      <!-- MODY (Mods) Button -->
      <v-btn
        block
        large
        outlined
        class="mods-btn text-white border-gray-600 hover:border-gray-300"
        @click="openMods"
      >
        <v-icon left>
          extension
        </v-icon>
        {{ t('mod.name') }}
        <v-chip
          v-if="isSyncing"
          x-small
          class="ml-2"
          color="primary"
        >
          <v-progress-circular
            indeterminate
            :size="10"
            :width="1"
            class="mr-1"
          />
          {{ t('clipclient.syncing') }}
        </v-chip>
        <v-chip
          v-else-if="remoteMods.length"
          x-small
          class="ml-2"
          color="grey darken-1"
        >
          {{ remoteMods.length }}
        </v-chip>
      </v-btn>

      <!-- DISCORD Button -->
      <v-btn
        block
        large
        outlined
        class="discord-btn border-indigo-600 text-indigo-400 hover:border-indigo-400"
        target="browser"
        href="https://discord.gg/clipclient"
      >
        <v-icon left>
          $vuetify.icons.discord
        </v-icon>
        Discord
      </v-btn>
    </div>

    <!-- Footer / Version info -->
    <div class="footer text-center text-gray-600 text-xs flex flex-col gap-1">
      <div>
        {{ t('clipclient.versionLocked') }}
      </div>
      <div v-if="syncError" class="text-red-400">
        <v-icon x-small color="red">
          warning
        </v-icon>
        {{ t('clipclient.modSyncError') }}
      </div>
      <div v-else-if="lastSyncedAt" class="text-gray-600">
        {{ t('clipclient.lastSync', { time: lastSyncTime }) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { kLaunchButton } from '@/composables/launchButton'
import { kModsManager } from '@/composables/modsManager'
import { injection } from '@/util/inject'

const { t } = useI18n()
const router = useRouter()

const {
  onClick: onLaunch,
  color: launchColor,
  icon: launchIcon,
  text: launchText,
  loading: launchLoading,
  leftIcon: launchLeftIcon,
} = injection(kLaunchButton)

const { remoteMods, isSyncing, syncError, lastSyncedAt } = injection(kModsManager)

const lastSyncTime = computed(() => {
  if (!lastSyncedAt.value) return ''
  return lastSyncedAt.value.toLocaleTimeString()
})

function openMods() {
  router.push('/mods')
}
</script>

<style scoped>
.game-panel {
  background: rgba(0, 0, 0, 0.2);
}

.logo-text {
  font-size: 2.8rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  line-height: 1;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.6);
}

.logo-text .clip {
  color: #ffffff;
}

.logo-text .client {
  color: var(--color-primary, #4caf50);
}

.play-btn {
  border-radius: 12px !important;
  min-height: 56px !important;
  box-shadow: 0 4px 24px rgba(76, 175, 80, 0.3) !important;
  transition: box-shadow 0.2s ease, transform 0.1s ease !important;
}

.play-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 32px rgba(76, 175, 80, 0.45) !important;
}

.mods-btn,
.discord-btn {
  border-radius: 10px !important;
  min-height: 44px !important;
  transition: transform 0.1s ease !important;
}

.mods-btn:hover,
.discord-btn:hover {
  transform: translateY(-1px);
}
</style>
