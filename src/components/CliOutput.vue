<template>
  <div 
    ref="outputContainer"
    class="chalk-output"
    v-html="formattedOutput"
  />
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import AnsiToHtml from 'ansi-to-html'

const props = withDefaults(defineProps<{
  content: string
  autoScroll?: boolean
}>(), {
  autoScroll: true
})

const outputContainer = ref<HTMLDivElement | null>(null)

const converter = new AnsiToHtml({
  fg: '#FFF',
  bg: '#1e1e1e',
  newline: true,
  escapeXML: true
})

const formattedOutput = computed(() => {
  return converter.toHtml(props.content)
})

watch(() => props.content, () => {
  if (props.autoScroll && outputContainer.value) {
    nextTick(() => {
      outputContainer.value!.scrollTop = outputContainer.value!.scrollHeight
    })
  }
})
</script>

<style scoped>
.chalk-output {
  font-family: 'Menlo', 'Monaco', 'Consolas', monospace;
  background-color: #1e1e1e;
  color: #e0e0e0;
  padding: 12px;
  border-radius: 6px;
  max-height: 400px;
  min-height: 200px;
  overflow-y: auto;
  white-space: pre-wrap;
  line-height: 1.5;
}

:deep(.ansi-black-fg) { color: #1e1e1e; }
:deep(.ansi-red-fg) { color: #ff5252; }
:deep(.ansi-green-fg) { color: #69f0ae; }
:deep(.ansi-yellow-fg) { color: #ffb74d; }
:deep(.ansi-blue-fg) { color: #40c4ff; }
:deep(.ansi-magenta-fg) { color: #ff4081; }
:deep(.ansi-cyan-fg) { color: #18ffff; }
:deep(.ansi-white-fg) { color: #e0e0e0; }

:deep(.ansi-bright-black-fg) { color: #616161; }
:deep(.ansi-bright-red-fg) { color: #ff6e6e; }
:deep(.ansi-bright-green-fg) { color: #9cffd4; }
:deep(.ansi-bright-yellow-fg) { color: #ffe082; }
:deep(.ansi-bright-blue-fg) { color: #80d8ff; }
:deep(.ansi-bright-magenta-fg) { color: #ff80ab; }
:deep(.ansi-bright-cyan-fg) { color: #84ffff; }
:deep(.ansi-bright-white-fg) { color: #ffffff; }
</style>