import { ipcMain, dialog, BrowserWindow } from "electron"
// 系统相关的操作
export async function initFsUtil() {
  ipcMain.handle('dialog:openFile', (_, win) => handleFileOpen(win))
  ipcMain.handle('dialog:openFolder', (_, win) => handleFolderOpen(win))
}
// 打开文件
async function handleFileOpen(win: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, { properties: ['openFile'] })
  if (!canceled) {
    return filePaths[0]
  } else {
    return false
  }
}

// 打开文件夹
async function handleFolderOpen(win: BrowserWindow) {
  const { canceled, filePaths } = await dialog.showOpenDialog(win, { properties: ['openDirectory'] })
  if (!canceled) {
    return filePaths[0]
  } else {
    return false
  }
}
