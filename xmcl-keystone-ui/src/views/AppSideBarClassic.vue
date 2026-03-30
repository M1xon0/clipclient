<template>
  <v-navigation-drawer
    v-if="!isHorizontal"
    :value="true"
    permanent
    :width="210"
    :color="sideBarColor"
    class="sidebar moveable z-10 rounded-[0.75rem]"
    :style="{ 'backdrop-filter': `blur(${blurSidebar}px)` }"
  >
    <!-- Logo -->
    <div class="flex justify-center px-4 pt-5 pb-4 non-moveable">
      <img
        :src="logoImg"
        alt="ClipClient"
        class="w-full object-contain"
        style="max-height: 72px;"
      >
    </div>

    <v-divider class="mx-3 mb-3" />

    <!-- Graj (Play) -->
    <div class="px-3 mb-3">
      <v-btn
        block
        :color="launchColor"
        :loading="launching"
        :disabled="isValidating"
        class="graj-btn non-moveable"
        @click="onLaunchClick()"
      >
        <v-icon left>
          play_arrow
        </v-icon>
        Graj
      </v-btn>
    </div>

    <!-- Nav items -->
    <v-list nav dense class="px-2">
      <!-- Mody -->
      <v-list-item
        link
        push
        to="/mods"
        class="non-moveable sidebar-item"
      >
        <v-list-item-icon>
          <v-icon>extension</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Mody</v-list-item-title>
      </v-list-item>

      <!-- Discord -->
      <v-list-item
        class="non-moveable sidebar-item"
        @click="openDiscord"
      >
        <v-list-item-icon>
          <v-icon>chat_bubble</v-icon>
        </v-list-item-icon>
        <v-list-item-title>Discord</v-list-item-title>
      </v-list-item>

      <!-- Ustawienia -->
      <v-list-item
        link
        push
        to="/setting"
        class="non-moveable sidebar-item"
      >
        <v-list-item-icon>
          <v-badge
            right
            overlap
            :value="state?.updateStatus !== 'none'"
          >
            <template #badge>
              <span>{{ 1 }}</span>
            </template>
            <v-icon>settings</v-icon>
          </v-badge>
        </v-list-item-icon>
        <v-list-item-title>Ustawienia</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <div
    v-else
    class="sidebar-horizontal moveable z-10 rounded-[0.75rem] flex flex-row items-center px-2 h-12 mx-2 my-2 elevation-4"
    :style="{ 'backdrop-filter': `blur(${blurSidebar}px)`, backgroundColor: sideBarColor }"
  >
    <img
      :src="logoImg"
      alt="ClipClient"
      class="h-8 object-contain mr-3 non-moveable"
    >

    <v-btn
      small
      :color="launchColor"
      :loading="launching"
      :disabled="isValidating"
      class="non-moveable mr-2 graj-btn"
      @click="onLaunchClick()"
    >
      <v-icon left small>
        play_arrow
      </v-icon>
      Graj
    </v-btn>

    <v-btn
      icon
      to="/mods"
      class="non-moveable mr-1"
      v-shared-tooltip.bottom="'Mody'"
    >
      <v-icon>extension</v-icon>
    </v-btn>

    <v-btn
      icon
      class="non-moveable mr-1"
      v-shared-tooltip.bottom="'Discord'"
      @click="openDiscord"
    >
      <v-icon>chat_bubble</v-icon>
    </v-btn>

    <v-btn
      icon
      to="/setting"
      class="non-moveable"
      v-shared-tooltip.bottom="'Ustawienia'"
    >
      <v-badge
        right
        overlap
        :value="state?.updateStatus !== 'none'"
      >
        <template #badge>
          <span>{{ 1 }}</span>
        </template>
        <v-icon>settings</v-icon>
      </v-badge>
    </v-btn>
  </div>
</template>

<script lang=ts setup>
import logoImg from '@/assets/logo.webp'
import { kLaunchButton } from '@/composables/launchButton'
import { kInstances } from '@/composables/instances'
import { kSettingsState } from '@/composables/setting'
import { useInjectSidebarSettings } from '@/composables/sidebarSettings'
import { kTheme } from '@/composables/theme'
import { vSharedTooltip } from '@/directives/sharedTooltip'
import { injection } from '@/util/inject'

const DISCORD_URL = 'https://discord.gg/W5XVwYY7GQ'

const { blurSidebar } = injection(kTheme)
const { state } = injection(kSettingsState)
const { position } = useInjectSidebarSettings()
const { isValidating } = injection(kInstances)

const isHorizontal = computed(() => position.value === 'top' || position.value === 'bottom')

const { sideBarColor } = injection(kTheme)
const { onClick: onLaunchClick, color: launchColor, loading: launching } = injection(kLaunchButton)

function openDiscord() {
  window.open(DISCORD_URL, 'browser')
}
</script>

<style scoped>
.sidebar {
  min-width: 210px;
  max-height: 100%;
  display: flex;
  flex-direction: column;
}

.graj-btn {
  font-weight: 700;
  letter-spacing: 0.05em;
}
</style>
<style>

.dark .sidebar .v-list-item .theme--dark.v-icon {
  color: var(--icon-color);
}

.dark .sidebar .v-list-item:hover .theme--dark.v-icon {
  color: var(--icon-color-hovered);
}


.v-navigation-drawer__content {
  @apply flex flex-col flex-grow-0 h-full;
}

.sidebar .v-list .v-list-item--active, .v-list .v-list-item--active .v-icon {
  color: var(--color-primary);
}

.sidebar .v-list-item--link:before {
  @apply text-white;
}

.sidebar .theme--dark.v-list-item--active:hover:before {
  opacity: .5;
}

.sidebar .theme--light.v-list-item--active:before {
  opacity: .25;
  background-color: gray;
}

.avatar .v-list-group__header.v-list-item--active:not(:hover):not(:focus):before {
  opacity: .24;
}
</style>
