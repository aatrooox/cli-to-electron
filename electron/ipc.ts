import { ipcMain } from 'electron'
import { BinaryService } from './cli'
const binaryName = process.platform === 'win32' ? 'z-cli' : 'z-cli'
const binaryService = new BinaryService(binaryName)

ipcMain.handle('z-cli', async (_, args: string[]) => {
  console.log(`args`, args)
  try {
    const result = await binaryService.execute(args)

    return {
      success: result.stderr === '', // 没有 stderr 表示成功
      output: result.stdout,
      error: result.stderr
    }
  } catch (error: any) {
    return {
      success: false,
      output: '',
      error: error.message
    }
    // throw new Error(`执行失败111: ${error.message}`)
  }
})