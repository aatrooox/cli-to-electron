import { ipcMain } from 'electron'
import { BinaryService } from './cli'
import { processManager } from './processManager'
const binaryName = process.platform === 'win32' ? 'z-cli' : 'z-cli'
const binaryService = new BinaryService(binaryName)

ipcMain.handle('z-cli', async (event, args: string[]) => {
  try {
    await binaryService.execute(args, event)
  } catch (error: any) {
    event.sender.send('z-cli-output', {
      type: 'stderr',
      data: `执行失败: ${error.message}\n`
    })
  }
})

ipcMain.on('kill-all-processes', (event) => {
  processManager.killAllProcesses(event);
})