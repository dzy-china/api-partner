
/*
示例：
const ApiSqlite = require("./src/js/ApiSqlite");
const apiSqlite = new ApiSqlite("./src/data/api_db.db");

apiSqlite.query("select * from hs_routes").then((result)=>{
	console.log(result)
})

*/

const Sqlite3 =  require('sqlite3').verbose();

module.exports = class ApiSqlite{
    db = null

    constructor(sqlite_path) {
        this.db = new Sqlite3.Database(sqlite_path, (err) => {
            if (err) {
                console.error(err.message);
            }
        });
    }

    /**
     apiSqlite.add(
         "INSERT INTO hs_routes(method, url, response_content) VALUES (?, ?,?)",
         ["post", "/user", "123"]
     ).then((result)=>{
            console.log(result)
        })
     * @param sql
     * @param sqlArgs
     */
     add(sql, sqlArgs = [] )  {
         return new Promise((resolve,reject)=>{
                this.db.run(sql, sqlArgs, function(err) {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(this.lastID);
                });
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
        return new Promise((resolve,reject)=>{
            this.db.run(sql, sqlArgs, function(err) {
                if (err) {
                    reject(err.message);
                }
                resolve(this.changes);
            });
        })
    }

    /**
     apiSqlite.update(
         "UPDATE hs_routes SET response_content=? WHERE id=?",
         ["999",1]
     ).then((result)=>{
        console.log(result)
     })
     * @param sql
     * @param sqlArgs
     */
    update(sql,sqlArgs = [] ){
        return   new Promise((resolve, reject)=>{
            this.db.run(sql, sqlArgs, function(err) {
                if (err) {
                    reject(err.message);
                }
                resolve(this.changes);
            });
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
            return   new Promise((resolve, reject)=>{
                this.db.all(sql, sqlArgs, (err, rows) => {
                    if (err) {
                        reject(err.message);
                    }
                    resolve(rows)
                })
            })
    }
}