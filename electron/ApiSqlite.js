
/*
查询示例：
const ApiSqlite = require("./src/js/ApiSqlite");
const apiSqlite = new ApiSqlite("./src/data/api_db.db");

apiSqlite.query("select * from hs_routes").then((result)=>{
	console.log(result)
})

*/
const fs = require('fs')
const initSqlJs = require('sql.js')

module.exports = class ApiSqlite{
    db = null
    sqlitePath = ""

    constructor(sqlite_path) {
        this.sqlitePath = sqlite_path;
    }

    // 初始化sql连接
    async init_link() {
        // 1. 异步加载sqlite驱动
        const SQL = await initSqlJs();
        // 创建sqlite连接实例
        const fileBuffer = fs.readFileSync(this.sqlitePath);
        this.db = new SQL.Database(fileBuffer);
    }


    /**
     apiSqlite.add(
     "INSERT INTO hs_routes(method, url, response) VALUES (?, ?,?)",
     ["post", "/user", "123"]
     ).then((result)=>{
                console.log(result)
            })
     * @param sql
     * @param sqlArgs
     */
    add(sql, sqlArgs = []) {
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行新增
                const stmt = this.db.prepare(sql);
                stmt.bind(sqlArgs); //绑定值
                stmt.run(); // 执行sql
                stmt.free(); // 释放语句使用的内存

                // 数据同步到sqlite文件
                this.writeSqlite();
                resolve("ok")
            }catch (e) {
                reject(e)
            }
        })
    }


    /**
     apiSqlite.delete(
     "DELETE FROM hs_routes WHERE id=?",
     [7]
     ).then((result)=>{
            console.log(result)
        })
     * @param sql
     * @param sqlArgs
     */
    delete(sql,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行新增
                const stmt = this.db.prepare(sql);
                stmt.bind(sqlArgs); //绑定值
                stmt.run(); // 执行sql
                stmt.free(); // 释放语句使用的内存

                // 数据同步到sqlite文件
                this.writeSqlite();
                resolve("ok")
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     apiSqlite.update(
     "UPDATE hs_routes SET response=? WHERE id=?",
     ["999",1]
     ).then((result)=>{
            console.log(result)
         })
     * @param sql
     * @param sqlArgs
     */
    update(sql,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行新增
                const stmt = this.db.prepare(sql);
                stmt.bind(sqlArgs); //绑定值
                stmt.run(); // 执行sql
                stmt.free(); // 释放语句使用的内存

                // 数据同步到sqlite文件
                this.writeSqlite();
                resolve("ok")
            }catch (e) {
                reject(e)
            }
        })
    }

    /**
     apiSqlite.query("select* from hs_routes").then((result)=>{
            console.log(result)
         })

     * @param sql
     * @param sqlArgs
     */
    query( sql ,sqlArgs = [] ){
        return new Promise(async (resolve, reject) => {
            try{
                // 保证连接对象存在
                if(!this.db) await this.init_link();

                // 执行新增
                const query_stmt = this.db.prepare(sql);
                query_stmt.bind(sqlArgs); //绑定值
                const result = [];
                while(query_stmt.step()) { // 遍历每行值
                    const row = query_stmt.getAsObject();
                    result.push(row)
                }

                // 释放语句使用的内存*/
                query_stmt.free();

                // 响应获取到的数据
                resolve(result)
            }catch(e){
                reject(e)
            }

        })
    }

    /**
     * 内存数据同步到sqlite文件
     */
    writeSqlite(){
        const data = this.db.export();
        const buffer = Buffer.from(data);
        fs.writeFileSync(this.sqlitePath, buffer);
    }
}