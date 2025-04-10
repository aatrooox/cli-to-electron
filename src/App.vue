<script setup lang="ts">
import CliOutput from './components/CliOutput.vue'
import CliCmdBar from './components/CliCmdBar.vue'
import { cliCmds } from './config.ts'
import { ref, onMounted } from 'vue'
const cliOutput = ref('')

const execCmd = async (cmd: any) => {
  
  let args = []
  args.push(cmd.name);
  args = args.concat(cmd.args)
  console.log(`args`, args)
  cliOutput.value = `正在执行: ${args}`
  await window.ipcRenderer.invoke('z-cli', args)
}

onMounted(() => {
  window.ipcRenderer.on('z-cli-output', (_, data) => {
    if (data.type === 'stdout') {
      // 处理标准输出
      cliOutput.value += data.data
    } else if (data.type === 'stderr') {
      // 处理错误输出
      cliOutput.value += data.data
    }
  })
})
</script>

<template>
  <div class="w-full h-full container flex flex-col gap-4">
    <CliCmdBar :commands="cliCmds" @command="execCmd"></CliCmdBar>
    <CliOutput :content="cliOutput" />
  </div>
</template>
