const mysql =  require("mysql")
const conn = mysql.createConnection({
    host:"localhost",
    user: "root",
    password: "",
    database: "softwarecomtdi_softcomptwo"
})
conn.connect((err) => {
    if(err) throw err
    console.log("connection created !!")
});

module.exports.conn = conn