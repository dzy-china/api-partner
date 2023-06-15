
import  { contextBridge ,ipcRenderer}   from 'electron'

// 暴露给渲染进程的数据，通过：window.main获取
contextBridge.exposeInMainWorld('electronAPI',{
    ipcRendererSend: ipcRenderer.send,
    fromMain: (callback) => ipcRenderer.on('fromMain', callback),
    expressPort: process.env.expressPort,
})