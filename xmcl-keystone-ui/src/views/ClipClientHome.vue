<template>
  <div class="clipclient-home select-none">
    <!-- Logo section -->
    <div class="logo-section">
      <h1 class="clipclient-title main-title">ClipClient</h1>
      <p class="subtitle">Minecraft 1.21.1 · NeoForge</p>
    </div>

    <!-- Mod status messages -->
    <div class="status-section">
      <div class="status-item">
        <v-icon small :color="modsStatusColor">
          {{ modsStatusIcon }}
        </v-icon>
        <span class="status-text">{{ modsStatusText }}</span>
      </div>
    </div>

    <!-- Main action buttons -->
    <div class="main-buttons">
      <!-- ClipSMP Server button -->
      <v-btn
        class="main-btn server-btn"
        large
        :color="serverOnline ? 'primary' : undefined"
        :loading="pinging"
        @click="launchServer"
      >
        <div class="btn-inner">
          <div class="flex items-center gap-3">
            <span
              class="status-dot"
              :class="{ online: serverOnline, offline: !serverOnline && !pinging }"
            />
            <span>ClipSMP server</span>
          </div>
          <span v-if="serverOnline" class="player-count">
            {{ serverPlayers }}/{{ serverMaxPlayers }}
          </span>
        </div>
      </v-btn>

      <!-- Singleplayer button -->
      <v-btn
        class="main-btn"
        large
        @click="launchSingleplayer"
      >
        <v-icon left>games</v-icon>
        Singleplayer
      </v-btn>

      <!-- Chat / Discord button -->
      <v-btn
        class="main-btn discord-btn"
        large
        @click="openDiscord"
      >
        <v-icon left>chat</v-icon>
        Chat (Discord)
      </v-btn>
    </div>

    <!-- Bottom bar -->
    <div class="bottom-bar">
      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon class="bottom-btn" v-on="on" @click="exitApp">
            <v-icon>close</v-icon>
          </v-btn>
        </template>
        <span>Exit</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon class="bottom-btn discord-icon-btn" v-on="on" @click="openDiscord">
            <v-icon>chat</v-icon>
          </v-btn>
        </template>
        <span>Discord</span>
      </v-tooltip>

      <v-tooltip top>
        <template #activator="{ on }">
          <v-btn icon class="bottom-btn" v-on="on" @click="openNews">
            <v-icon>article</v-icon>
          </v-btn>
        </template>
        <span>News / Mods</span>
      </v-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { kInstanceLaunch } from '@/composables/instanceLaunch'
import { injection } from '@/util/inject'
import { useServerStatus } from '@/composables/serverStatus'

const { launch } = injection(kInstanceLaunch)
const CLIPSMP_SERVER_HOST = 'play.clipsmp.pl'
const CLIPSMP_SERVER_PORT = 25565
const DISCORD_URL = 'https://discord.gg/clipsmp'
const NEWS_URL = 'https://github.com/M1xon0/modyclip'
const MODS_REPO_URL = 'https://github.com/M1xon0/modyclip'

const serverAddress = computed(() => ({ host: CLIPSMP_SERVER_HOST, port: CLIPSMP_SERVER_PORT }))
const serverProtocol = ref<number | undefined>(undefined)
const { refresh, status, pinging } = useServerStatus(serverAddress, serverProtocol)

const serverOnline = computed(() => (status.value.players?.online ?? -1) >= 0 && (status.value.ping ?? 0) > 0)
const serverPlayers = computed(() => status.value.players?.online ?? 0)
const serverMaxPlayers = computed(() => status.value.players?.max ?? 0)

const modsStatusLoading = ref(true)
const modsStatusOk = ref(false)

onMounted(() => {
  refresh()
  fetchModsStatus()
})

async function fetchModsStatus() {
  try {
    const res = await fetch(MODS_REPO_URL)
    modsStatusOk.value = res.ok
  } catch {
    modsStatusOk.value = false
  } finally {
    modsStatusLoading.value = false
  }
}

const modsStatusText = computed(() => {
  if (modsStatusLoading.value) return 'Loading mods from repository...'
  if (modsStatusOk.value) return 'Mods loaded from ' + MODS_REPO_URL
  return 'Downloading mods from ' + MODS_REPO_URL
})

const modsStatusColor = computed(() => {
  if (modsStatusLoading.value) return 'warning'
  if (modsStatusOk.value) return 'success'
  return 'warning'
})

const modsStatusIcon = computed(() => {
  if (modsStatusLoading.value) return 'sync'
  if (modsStatusOk.value) return 'check_circle'
  return 'warning'
})

function launchServer() {
  launch('client', { server: { host: CLIPSMP_SERVER_HOST, port: CLIPSMP_SERVER_PORT } })
}

function launchSingleplayer() {
  launch('client')
}

function openDiscord() {
  window.open(DISCORD_URL)
}

function openNews() {
  window.open(NEWS_URL)
}

function exitApp() {
  windowController.close()
}
</script>

<style scoped>
.clipclient-home {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  min-height: calc(100vh - 120px);
  padding: 2rem 1.5rem 1rem;
  gap: 1.5rem;
}

.logo-section {
  text-align: center;
  padding-top: 1rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.3;
}

@media (max-width: 700px) {
  .main-title {
    font-size: 1.5rem;
  }
}

.subtitle {
  font-family: 'Press Start 2P', cursive;
  font-size: 0.65rem;
  color: var(--clipclient-primary);
  letter-spacing: 1px;
  opacity: 0.85;
  margin-top: 0.25rem;
}

.status-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-height: 2rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  opacity: 0.85;
}

.status-text {
  font-size: 0.7rem;
}

.main-buttons {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  width: 100%;
  max-width: 400px;
}

.main-btn {
  width: 100%;
  font-family: 'Press Start 2P', cursive !important;
  font-size: 0.65rem !important;
  letter-spacing: 1px !important;
  min-height: 52px !important;
  border: 2px solid var(--clipclient-primary) !important;
  transition: box-shadow 0.2s, transform 0.1s !important;
}

.main-btn:hover {
  box-shadow: 0 0 12px var(--clipclient-primary), 0 0 24px rgba(50, 255, 150, 0.2) !important;
  transform: translateY(-1px);
}

.server-btn {
  border-color: var(--clipclient-primary) !important;
}

.discord-btn {
  border-color: #7289da !important;
}

.btn-inner {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #aaa;
  flex-shrink: 0;
  transition: background-color 0.3s;
}

.status-dot.online {
  background-color: var(--clipclient-primary);
  box-shadow: 0 0 6px var(--clipclient-primary);
}

.status-dot.offline {
  background-color: #f44336;
}

.player-count {
  font-size: 0.6rem;
  opacity: 0.8;
}

.bottom-bar {
  display: flex;
  justify-content: center;
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
}

.bottom-btn {
  opacity: 0.7;
  transition: opacity 0.2s, color 0.2s;
}

.bottom-btn:hover {
  opacity: 1;
}

.discord-icon-btn:hover {
  color: #7289da !important;
}
</style>
