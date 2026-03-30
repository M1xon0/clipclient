<template>
  <v-list
    class="base-settings"
    subheader
    color="transparent"
  >
    <v-subheader>
      {{ t('version.name', 2) }}
      <div class="flex-grow" />
      <v-btn
        text
        :disabled="!versionHeader || isModified"
        @click="onFix"
      >
        <v-icon left>
          build
        </v-icon>
        {{ t('version.checkIntegrity') }}
      </v-btn>
    </v-subheader>

    <!-- ClipClient: version locked to 1.21.1 NeoForge -->
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="d-flex align-center gap-2">
          <v-icon left small color="primary">lock</v-icon>
          Minecraft 1.21.1 · NeoForge
        </v-list-item-title>
        <v-list-item-subtitle>
          Game version is locked by ClipClient
        </v-list-item-subtitle>
      </v-list-item-content>
    </v-list-item>

    <VersionInputLocal
      :value="data.version"
      :versions="versions"
      :placeholder="versionHeader ? versionHeader.id : undefined"
      @input="onSelectLocalVersion"
    />
    <SimpleDialog
      v-model="reinstallDialogModel"
      :width="390"
      :title="t('localVersion.reinstallTitle', { version: reinstallDialog.target.value })"
      :confirm-icon="'build'"
      :color="'orange en-1'"
      :confirm="t('shared.yes')"
      @cancel="reinstallDialog.cancel"
      @confirm="reinstallDialog.confirm"
    >
      {{ t('localVersion.reinstallDescription') }}
    </SimpleDialog>
  </v-list>
</template>

<script lang=ts setup>
import SimpleDialog from '@/components/SimpleDialog.vue'
import VersionInputLocal from '@/components/VersionInputLocal.vue'
import { useService } from '@/composables'
import { useSimpleDialog } from '@/composables/dialog'
import { kInstanceVersion } from '@/composables/instanceVersion'
import { kLocalVersions } from '@/composables/versionLocal'
import { injection } from '@/util/inject'
import { InstallServiceKey } from '@xmcl/runtime-api'
import { InstanceEditInjectionKey, useInstanceEditVersions } from '../composables/instanceEdit'

const props = defineProps<{
  isExpanded: boolean
}>()

const {
  data,
  isModified,
} = injection(InstanceEditInjectionKey)
const { versions } = injection(kLocalVersions)

const {
  onSelectLocalVersion,
} = useInstanceEditVersions(data, versions)

const { versionHeader } = injection(kInstanceVersion)
function onFix() {
  if (versionHeader.value) {
    reinstallDialog.show(versionHeader.value.id)
  }
}

const { reinstall } = useService(InstallServiceKey)
const reinstallDialog = useSimpleDialog<string>((v) => {
  if (!v) return
  reinstall({
    version: v,
    side: 'client',
  })
})
const reinstallDialogModel = reinstallDialog.model

const { t } = useI18n()
</script>

<style scoped=true>
.flex {
  padding: 6px 8px !important
}
.v-btn {
  margin: 0
}
</style>
