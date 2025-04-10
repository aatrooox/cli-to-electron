import { ChildProcess } from 'child_process';

const processes: ChildProcess[] = [];

export const processManager = {
  addProcess(process: ChildProcess): void {
    processes.push(process);
  },

  removeProcess(process: ChildProcess): void {
    const index = processes.indexOf(process);
    if (index !== -1) {
      processes.splice(index, 1);
    }
  },

  killAllProcesses(event?: Electron.IpcMainEvent): void {
    console.log(`清除子进程[${processes.length}]`, )
    processes.forEach(process => {
      if (!process.killed && process.pid) {
        console.log(`kill process ${process.pid}`);
        event?.sender.send('z-cli-output', {
          type: 'stderr',
          data: `kill process ${process.pid}\n`
        })
        process.kill();
      }
    });
    processes.length = 0; // 清空数组
  },

  /**
   * 获取当前所有进程
   */
  getProcesses(): ChildProcess[] {
    return [...processes]; // 返回副本以防止外部修改
  }
};