<template>
  <v-navigation-drawer
    v-if="!isHorizontal"
    :value="true"
    permanent
    :color="sideBarColor"
    class="clip-sidebar moveable z-10 rounded-[0.75rem]"
    :style="{ 'backdrop-filter': `blur(${blurSidebar}px)` }"
    width="180"
  >
    <!-- Logo section -->
    <div class="clip-logo-section non-moveable flex flex-col items-center py-4 px-3">
      <img
        :src="logoSrc"
        alt="ClipClient"
        class="clip-logo"
      >
    </div>

    <v-divider class="clip-divider mx-3" />

    <!-- Main nav buttons -->
    <div class="clip-nav flex flex-col gap-1 px-3 pt-3">
      <!-- Graj -->
      <v-btn
        depressed
        block
        class="clip-btn clip-btn--play non-moveable justify-start"
        :loading="launchLoading"
        @click="onLaunch"
      >
        <v-icon left size="20">
          play_arrow
        </v-icon>
        Graj
      </v-btn>

      <!-- Mody -->
      <v-btn
        depressed
        block
        exact
        to="/mods"
        class="clip-btn non-moveable justify-start"
      >
        <v-icon left size="20">
          extension
        </v-icon>
        Mody
      </v-btn>

      <!-- Discord -->
      <v-btn
        depressed
        block
        class="clip-btn clip-btn--discord non-moveable justify-start"
        @click="openDiscord"
      >
        <v-icon left size="20">
          chat
        </v-icon>
        Discord
      </v-btn>
    </div>

    <div class="flex-1" />

    <v-divider class="clip-divider mx-3 mb-2" />

    <!-- Settings at bottom -->
    <div class="clip-nav px-3 pb-3">
      <v-btn
        depressed
        block
        exact
        to="/setting"
        class="clip-btn non-moveable justify-start"
      >
        <v-badge
          right
          overlap
          :value="state?.updateStatus !== 'none'"
        >
          <template #badge>
            <span>1</span>
          </template>
          <v-icon left size="20">
            settings
          </v-icon>
        </v-badge>
        Ustawienia
      </v-btn>
    </div>
  </v-navigation-drawer>

  <!-- Horizontal layout (top/bottom position) -->
  <div
    v-else
    class="sidebar-horizontal moveable z-10 rounded-[0.75rem] flex flex-row items-center px-2 h-12 mx-2 my-2 elevation-4"
    :style="{ 'backdrop-filter': `blur(${blurSidebar}px)`, backgroundColor: sideBarColor }"
  >
    <img :src="logoSrc" alt="ClipClient" class="h-8 mr-3 object-contain non-moveable">

    <v-btn
      icon
      class="non-moveable mr-1"
      :loading="launchLoading"
      @click="onLaunch"
    >
      <v-icon>play_arrow</v-icon>
    </v-btn>

    <v-btn icon to="/mods" class="non-moveable mr-1">
      <v-icon>extension</v-icon>
    </v-btn>

    <v-btn icon class="non-moveable mr-1" @click="openDiscord">
      <v-icon>chat</v-icon>
    </v-btn>

    <div class="flex-grow-1" />

    <v-btn icon to="/setting" class="non-moveable">
      <v-badge right overlap :value="state?.updateStatus !== 'none'">
        <template #badge><span>1</span></template>
        <v-icon>settings</v-icon>
      </v-badge>
    </v-btn>
  </div>
</template>

<script lang=ts setup>
import { kLaunchButton } from '@/composables/launchButton'
import { kSettingsState } from '@/composables/setting'
import { useInjectSidebarSettings } from '@/composables/sidebarSettings'
import { kTheme } from '@/composables/theme'
import { injection } from '@/util/inject'
import logoSrc from '@/assets/logo.webp'

const { blurSidebar } = injection(kTheme)
const { state } = injection(kSettingsState)
const { position } = useInjectSidebarSettings()
const isHorizontal = computed(() => position.value === 'top' || position.value === 'bottom')

const { sideBarColor } = injection(kTheme)
const { onClick: onLaunch, loading: launchLoading } = injection(kLaunchButton)

const DISCORD_URL = 'https://discord.gg/clipclient'

function openDiscord() {
  window.open(DISCORD_URL, '_blank', 'noopener,noreferrer')
}
</script>

<style scoped>
.clip-sidebar {
  min-width: 180px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.clip-logo-section {
  min-height: 80px;
}

.clip-logo {
  width: 140px;
  max-height: 70px;
  object-fit: contain;
}

.clip-divider {
  border-color: rgba(50, 255, 150, 0.2) !important;
}

.clip-btn {
  text-transform: none !important;
  letter-spacing: 0.02em;
  font-size: 0.95rem !important;
  font-weight: 500 !important;
  border-radius: 8px !important;
  height: 42px !important;
  color: rgba(255, 255, 255, 0.85) !important;
  background: transparent !important;
  transition: background 0.15s, color 0.15s !important;
}

.clip-btn:hover,
.clip-btn:focus {
  background: rgba(50, 255, 150, 0.12) !important;
  color: #32ff96 !important;
}

.clip-btn--active,
.clip-btn.v-btn--active {
  background: rgba(50, 255, 150, 0.18) !important;
  color: #32ff96 !important;
}

.clip-btn--play {
  background: rgba(50, 255, 150, 0.15) !important;
  color: #32ff96 !important;
  border: 1px solid rgba(50, 255, 150, 0.4) !important;
}

.clip-btn--play:hover {
  background: rgba(50, 255, 150, 0.28) !important;
  border-color: #32ff96 !important;
}

.clip-btn--discord {
  color: rgba(255, 255, 255, 0.7) !important;
}

.clip-btn--discord:hover {
  background: rgba(114, 137, 218, 0.2) !important;
  color: #7289da !important;
}
</style>
<style>
.clip-sidebar .v-navigation-drawer__content {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.clip-sidebar .v-btn__content {
  justify-content: flex-start;
}
</style>
