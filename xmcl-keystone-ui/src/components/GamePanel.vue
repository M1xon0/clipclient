<template>
  <div class="game-panel d-flex flex-column align-center justify-center fill-height">
    <div class="logo-container mb-6">
      <img
        src="@/assets/LogoMinecraft.png"
        class="game-logo"
        alt="ClipClient"
        onerror="this.style.display='none'"
      >
      <span class="game-title text-h4 font-weight-bold white--text">ClipClient</span>
    </div>

    <div class="version-info mb-8 text-center">
      <v-chip color="primary" outlined small class="mr-2">
        Minecraft {{ lockedVersion }}
      </v-chip>
      <v-chip color="green" outlined small>
        NeoForge
      </v-chip>
    </div>

    <v-btn
      id="launch-button"
      x-large
      color="primary"
      class="play-btn mb-4 px-12"
      :loading="launching"
      :disabled="!canPlay"
      @click="$emit('launch')"
    >
      <v-icon left>
        play_arrow
      </v-icon>
      {{ t('launch.launch') }}
    </v-btn>

    <div class="action-buttons d-flex gap-2">
      <v-btn
        outlined
        color="white"
        class="action-btn"
        @click="$emit('mods')"
      >
        <v-icon left small>
          extension
        </v-icon>
        {{ t('mod.name') }}
      </v-btn>

      <v-btn
        outlined
        color="indigo lighten-2"
        class="action-btn"
        href="https://discord.gg/clipclient"
        target="_blank"
        rel="noopener noreferrer"
      >
        <v-icon left small>
          mdi-discord
        </v-icon>
        Discord
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n-bridge'
import { LOCKED_MINECRAFT_VERSION } from '@/composables/useVersionLocker'

const { t } = useI18n()

const props = defineProps<{
  launching?: boolean
  canPlay?: boolean
}>()

defineEmits<{
  (e: 'launch'): void
  (e: 'mods'): void
}>()

const lockedVersion = LOCKED_MINECRAFT_VERSION
</script>

<style scoped>
.game-panel {
  width: 100%;
  height: 100%;
}

.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.game-logo {
  max-width: 120px;
  max-height: 120px;
  object-fit: contain;
}

.game-title {
  letter-spacing: 0.05em;
}

.play-btn {
  min-width: 200px;
  font-size: 1.1rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.05em;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
}

.action-btn {
  min-width: 130px;
}
</style>
