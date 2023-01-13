const mysql =  require("mysql")
const conn = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "express"
})
conn.connect((err) => {
    if(err) throw err
    console.log("connection created !!")
});

module.exports.conn = conn