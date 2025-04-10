<script setup lang="ts">
import CliOutput from './components/CliOutput.vue'
import CliCmdBar from './components/CliCmdBar.vue'
import { cliCmds } from './config.ts'
import { ref } from 'vue'
const cliOutput = ref('')

const execCmd = async (cmd: any) => {
  
  let args = []
  args.push(cmd.name);
  args = args.concat(cmd.args)
  console.log(`args`, args)
  cliOutput.value = `正在执行: ${args}`
  const res = await window.ipcRenderer.invoke('z-cli', args)
  cliOutput.value = res.output || res.error
}
</script>

<template>
  <div class="w-full h-full container flex flex-col gap-4">
    <CliCmdBar :commands="cliCmds" @command="execCmd"></CliCmdBar>
    <CliOutput :content="cliOutput" />
  </div>
</template>
