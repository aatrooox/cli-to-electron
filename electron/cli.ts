import path from 'path'
import { spawn } from 'child_process'
import { processManager } from './processManager';

const childProcesses = [];
export function getBinaryPath(binaryName: string): string {
  // 开发环境
  if (process.env.NODE_ENV === 'development') {
    return path.join(process.cwd(), 'resources', 'bin', binaryName)
  }
  
  // 生产环境
  const isWin = process.platform === 'win32'
  return path.join(process.resourcesPath, 'bin', binaryName + (isWin ? '.exe' : ''))
}


export class BinaryService {
  private binaryPath: string

  constructor(binaryName: string) {
    this.binaryPath = getBinaryPath(binaryName)
  }


  async execute(args: string[] = [], event?: Electron.IpcMainInvokeEvent): Promise<{ stdout: string; stderr: string }> {
    return new Promise((resolve, reject) => {
      const process = spawn(this.binaryPath, args)
      childProcesses.push(process);
      let stdout = ''
      let stderr = ''
      
      processManager.addProcess(process)
      process.stdout.on('data', (data) => {
        const output = data.toString()
        stdout += output
        // 实时发送标准输出
        event?.sender.send('z-cli-output', {
          type: 'stdout',
          data: output
        })
      })
      
      process.stderr.on('data', (data) => {
        const output = data.toString()
        stderr += output
        // 实时发送错误输出
        event?.sender.send('z-cli-output', {
          type: 'stderr',
          data: output
        })
      })
      
      process.on('close', (code) => {
        event?.sender.send('z-cli-output', {
          type: 'stderr',
          data: `子进程已关闭[${code ?? ''}]\n`
        })
        if (code === 0) {
          resolve({ stdout, stderr })
        } else {
          reject(new Error(stderr || `Process exited with code ${code}`))
        }
      })
      
      process.on('error', (err) => {
        event?.sender.send('z-cli-output', {
          type: 'stderr',
          data: `子进程ERROR[${err.message}]\n`
        })
        reject(err)
      })
    })
  }
}