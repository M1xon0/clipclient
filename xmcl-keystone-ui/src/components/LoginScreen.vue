<template>
  <div class="login-screen d-flex flex-column align-center justify-center fill-height pa-6">
    <div class="login-header mb-6 text-center">
      <v-icon size="48" color="primary" class="mb-2">
        person
      </v-icon>
      <div class="text-h5 font-weight-bold white--text">
        {{ t('userAccount.add') }}
      </div>
      <div class="text-caption grey--text mt-1">
        {{ t('login.loginWithMicrosoft') }}
      </div>
    </div>

    <div
      v-if="hasUser"
      class="user-info d-flex flex-column align-center mb-6"
    >
      <v-avatar
        id="user-avatar"
        size="64"
        class="mb-3"
      >
        <img
          v-if="userAvatar"
          :src="userAvatar"
          :alt="userName"
        >
        <v-icon v-else size="40">
          person
        </v-icon>
      </v-avatar>
      <div class="text-subtitle-1 white--text font-weight-medium">
        {{ userName }}
      </div>
      <div class="text-caption grey--text">
        {{ userService }}
      </div>

      <v-btn
        text
        small
        color="grey"
        class="mt-3"
        @click="$emit('logout')"
      >
        <v-icon left x-small>
          logout
        </v-icon>
        {{ t('userAccount.signout') }}
      </v-btn>
    </div>

    <template v-else>
      <v-btn
        color="primary"
        large
        class="login-btn mb-3"
        :loading="loggingIn"
        @click="$emit('login', 'microsoft')"
      >
        <v-icon left>
          mdi-microsoft
        </v-icon>
        {{ t('login.loginWithMicrosoft') }}
      </v-btn>

      <v-btn
        text
        small
        color="grey"
        @click="$emit('login', 'offline')"
      >
        {{ t('userAccount.addOfflineUser') }}
      </v-btn>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n-bridge'

const { t } = useI18n()

defineProps<{
  hasUser?: boolean
  userAvatar?: string
  userName?: string
  userService?: string
  loggingIn?: boolean
}>()

defineEmits<{
  (e: 'login', type: 'microsoft' | 'offline'): void
  (e: 'logout'): void
}>()
</script>

<style scoped>
.login-screen {
  width: 100%;
  height: 100%;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.login-btn {
  min-width: 220px;
}
</style>
