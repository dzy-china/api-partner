
import { app, BrowserWindow, ipcMain, dialog} from 'electron';
import path from 'path';

import express from 'express';

let win = null
// 判断当前实例是不是第一个实例
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
    // 如果不是第一个实例，则退出应用
    app.quit()
} else {

    // 创建 Express 应用程序
    const expressApp = express();
    // 创建路由对象
    const router = express.Router();
    const expressPort = 8421
    process.env.expressPort = expressPort

    // 注册 Router 对象
    expressApp.use(router);

    // 启动应用程序
    const ExpressServer = expressApp.listen(expressPort, () => {
        console.log('Express server listening on port 3000!');
    });

    // 实例化 Sqlite
    const ApiSqlite = require("./ApiSqlite");
    const apiSqlite = new ApiSqlite( path.resolve(app.isPackaged?"resources/":"", "db/localData.db") );


    // 动态改变路由表
    const changeExpressRouter = (routes)=>{
      // routes格式：[ { method, url, response }, ... ]
        // 路由表
        router.stack = [] // 初始化路由表
        // 更新路由表
        for (const routesElement of routes) {
            router[routesElement.method](routesElement.url, function (req, res) {
                res.send(routesElement.response); // routesElement.response
            });
        }
    }

    // 动态改变路由数据
    const changeUIRouter = (event)=>{
        apiSqlite.query("select * from hs_routes").then((result)=>{ // 查询数据
            // 向渲染进程发送消息
            event.reply("fromMain", result)
            changeExpressRouter(result)
        })
    }


    // 监听渲染进程的消息
    // 1.初始化消息
    ipcMain.on('toMain', (event, data) => {
        changeUIRouter(event)
    })

    // 2.新增数据时触发消息
    ipcMain.on('toMainAdd', (event, data) => {
       const {method, url, response} =  JSON.parse(data);
        apiSqlite.add("insert into hs_routes(method, url, response) values(?,?,?)", [method, url, response]).then((result)=>{
            changeUIRouter(event)
        })

    })

    // 3.删除数据时触发消息
    ipcMain.on('toMainDel', (event, id) => {
        apiSqlite.delete("delete from hs_routes where id=? ", [id]).then((result)=>{
            changeUIRouter(event)
        })
    })

    // 4.编辑数据时触发消息
    ipcMain.on('toMainEdit', (event, data) => {
        const {id, method, url, response} =  JSON.parse(data);
        apiSqlite.update("update hs_routes set method=?,url=?,response=? where id=? ", [method, url, response, id]).then((result)=>{
            changeUIRouter(event)
        })
    })

    // 创建窗口
    const createWindow = async () => {

        win = new BrowserWindow({
            width: 1100,
            height: 800,
            autoHideMenuBar: true, // 隐藏默认菜单栏
            icon: path.resolve(app.isPackaged?"resources/":"public/", "images/apiLogo.ico"),
            //渲染进程预设
            webPreferences: {
                // nodeIntegration: true, // 开启在渲染进程中融入node
                // contextIsolation:false, // 关闭上下文隔离
                // enableRemoteModule:true,  // 开启可在渲染进程中直接引入node模块
                sandbox: false, // 开启关闭沙箱模式
                webviewTag:true,  // 开启webview
                preload: path.join(__dirname, 'preload.js'),
            }
        });

        // 消除electron控制台警告
        process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

        // 加载页面
        if (app.isPackaged) {
            await win.loadFile(path.join(__dirname, "../dist/index.html"));
        } else {
            await win.loadURL(`${process.env['VITE_DEV_SERVER_URL']}`)
        }

        // 加载页面完打开开发者工具
        // win.webContents.openDevTools({mode: 'bottom'});
    };


    // 应用程序开始运行
    app.on('ready', async ()=>{
        // 创建窗口并加载 Vite 页面
        await createWindow();

        // 当所有窗口都被关闭时
        app.on('window-all-closed', () => {
            if (process.platform !== 'darwin') {
                app.quit()
            }
        });
        // app退出时
        app.on('will-quit', () => {
            ExpressServer.close(function () {
                console.log('Express server has been closed!');
                // 执行一些其他清理操作
                process.exit();
            })
        });
    });



    // 在 macOS 上，当应用程序没有窗口时，重新激活该应用程序的行为
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });


    // 当第二个实例启动时，通过窗口的方法进行处理
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if (win) {
            if (win.isMinimized()) { // 是否最小化
                win.restore() // 恢复
            }
            win.focus()
        }
    })
}