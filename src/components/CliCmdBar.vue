<script setup lang="ts">
import { ref, computed, watch } from 'vue'

interface CliArg {
  flag: string | string[]
  name: string
  default: string
  required?: boolean
  type?: 'file' | 'dir' | 'input' | undefined
}

export interface CliCmd {
  name: string
  cmd: string
  args: CliArg[]
}

interface CommandOutput {
  name: string
  args: string[]
}

const props = defineProps<{
  commands: CliCmd[]
}>()

const emit = defineEmits<{
  (e: 'command', output: CommandOutput): void
}>()

const selectedCmd = ref<CliCmd | null>(null)
const selectedArg = ref<CliArg | null>(null)
const argValue = ref('')
const output = ref<CommandOutput | null>(null)

const availableArgs = computed(() => {
  return selectedCmd.value?.args || []
})

watch(selectedCmd, () => {
  selectedArg.value = null
  argValue.value = ''
})

watch(selectedArg, () => {
  if (selectedArg.value) {
    argValue.value = selectedArg.value.default || ''
  }
})

const isValid = computed(() => {
  if (!selectedCmd.value || !selectedArg.value) return false
  if (selectedArg.value.required && !argValue.value) return false
  return true
})

const getFilePath = async () => {
  const result = await window.ipcRenderer.invoke('dialog:openFile')  
  console.log(`result`, result)
  if (result) {
    argValue.value = result
  }
}
const getDirPath = async () => {
  const result = await window.ipcRenderer.invoke('dialog:openFolder')  
  console.log(`result`, result)
  if (result) {
    argValue.value = result
  }
}

const generateCommand = () => {
  if (!selectedCmd.value || !selectedArg.value) return
  
  const flag = Array.isArray(selectedArg.value.flag) 
    ? selectedArg.value.flag
    : [selectedArg.value.flag]
  
  output.value = {
    name: selectedCmd.value.cmd,
    args: flag.concat(argValue.value)
  }
  
  emit('command', output.value)
}
</script>

<template>
  <div class="cli-command-bar">
    <div class="command-inputs">
      <select v-model="selectedCmd">
        <option :value="null">选择命令</option>
        <option v-for="cmd in props.commands" :key="cmd.cmd" :value="cmd">
          {{ cmd.name }}
        </option>
      </select>

      <select v-model="selectedArg" :disabled="!selectedCmd">
        <option :value="null">选择参数</option>
        <option v-for="arg in availableArgs" :key="arg.name" :value="arg">
          {{ arg.name }}
        </option>
      </select>

      <input 
        v-model="argValue" 
        :placeholder="selectedArg?.required ? '必填项' : '可选值'"
        :class="{ 'required': selectedArg?.required }"
        :disabled="!selectedArg"
      />
      <button @click="getFilePath" v-if="selectedArg?.type === 'file'">获取文件路径</button>
      <button @click="getDirPath" v-if="selectedArg?.type === 'dir'">获取目录路径</button>
      <button @click="generateCommand" :disabled="!isValid">
        执行
      </button>
    </div>

    <!-- <div v-if="output" class="output">
      <pre>{{ JSON.stringify(output, null, 2) }}</pre>
    </div> -->
  </div>
</template>

<style scoped>
.cli-command-bar {
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
}

.command-inputs {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

select, input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 150px;
}

select:disabled, input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

input.required {
  border-color: #e74c3c;
}

button {
  padding: 8px 16px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 500;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.output {
  margin-top: 8px;
  padding: 12px;
  background-color: #f8f8f8;
  border-radius: 4px;
  border: 1px solid #eee;
}

.output pre {
  margin: 0;
  font-family: monospace;
}
</style>