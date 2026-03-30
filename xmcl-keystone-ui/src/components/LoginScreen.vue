<template>
  <div class="login-screen flex flex-col items-center justify-center h-full px-6 py-8">
    <transition name="fade-transition" mode="out-in">
      <!-- Logged-in state -->
      <div
        v-if="isLoggedIn"
        key="profile"
        class="flex flex-col items-center gap-6 w-full max-w-xs"
      >
        <div class="avatar-wrapper relative">
          <PlayerAvatar
            class="overflow-hidden rounded-full ring-4 ring-primary ring-offset-2 ring-offset-transparent shadow-xl"
            :src="gameProfile?.textures?.SKIN?.url"
            :dimension="96"
          />
          <div class="absolute -bottom-1 -right-1 bg-green-500 rounded-full w-5 h-5 border-2 border-white" />
        </div>
        <div class="text-center">
          <div class="text-2xl font-bold text-white">
            {{ gameProfile?.name ?? userProfile?.username ?? t('login.login') }}
          </div>
          <div class="text-sm text-gray-400 mt-1">
            {{ t('userAccount.loggedIn') }}
          </div>
        </div>
        <v-btn
          block
          outlined
          class="text-gray-300 border-gray-600 hover:border-gray-400"
          @click="showUserMenu = true"
        >
          <v-icon left small>
            manage_accounts
          </v-icon>
          {{ t('userAccount.manage') }}
        </v-btn>

        <v-dialog
          v-model="showUserMenu"
          max-width="600"
          content-class="user-card-dialog"
        >
          <UserCard
            outlined
            :show="showUserMenu"
            @close="showUserMenu = false"
          />
        </v-dialog>
      </div>

      <!-- Logged-out state -->
      <div
        v-else
        key="login"
        class="flex flex-col items-center gap-4 w-full max-w-xs"
      >
        <div class="text-center mb-2">
          <v-icon class="text-5xl text-primary mb-2">
            account_circle
          </v-icon>
          <div class="text-xl font-semibold text-white">
            {{ t('login.login') }}
          </div>
          <div class="text-sm text-gray-400 mt-1">
            {{ t('login.loginDescription') }}
          </div>
        </div>
        <UserLoginForm
          :inside="false"
          class="w-full"
          @login="onLoginSuccess"
          @add-service="showAddService = true"
        />
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import PlayerAvatar from '@/components/PlayerAvatar.vue'
import UserCard from '@/components/UserCard.vue'
import UserLoginForm from '@/components/UserLoginForm.vue'
import { kUserContext } from '@/composables/user'
import { injection } from '@/util/inject'

const { t } = useI18n()

const { userProfile, gameProfile, users } = injection(kUserContext)

const isLoggedIn = computed(
  () => users.value.length > 0 && !!userProfile.value?.id && !!gameProfile.value?.name,
)

const showUserMenu = ref(false)
const showAddService = ref(false)

function onLoginSuccess() {
  showAddService.value = false
}
</script>

<style scoped>
.login-screen {
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(12px);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.avatar-wrapper {
  filter: drop-shadow(0 4px 16px rgba(0, 0, 0, 0.5));
}
</style>
