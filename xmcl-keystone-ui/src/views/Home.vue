<template>
  <div
    ref="scrollElement"
    class="clip-home select-none h-full flex flex-col items-center justify-end"
  >
    <HomeCriticalError />
    <HomeFocusFooter class="absolute bottom-0 left-0 pb-[26px]" />
  </div>
</template>
<script lang="ts" setup>
import { useGlobalDrop } from '@/composables/dropHandler'
import { kCompact } from '@/composables/scrollTop'
import { injection } from '@/util/inject'
import HomeCriticalError from './HomeCriticalError.vue'
import HomeFocusFooter from './HomeFocusFooterV2.vue'
import { useDialog } from '@/composables/dialog'

const compact = injection(kCompact)
onMounted(() => {
  compact.value = false
})

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
