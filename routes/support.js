var express = require('express');
var router = express.Router();
const mysql = require("./connection").conn

router.get('/', function(req, res, next) {
  let qry =  "SELECT * FROM ticket";
  mysql.query(qry, function(err,result){
    if(err){
      throw err
    }else{

      res.render('support', { title: 'support Page',sampleData: result });
    }
  });
  });
  
  
  router.get('/add-new-ticket/', function(req, res, next) {
    res.render('support/addticket', { title: 'Add New ticket Page' });
  });
  router.post("/addticket", (req,res) =>{
    var title = req.body.title;
    var subject = req.body.subject;
    var priority = req.body.priority;
    var department = req.body.department;
    var user = req.body.user;
    var action = req.body.action;
    var status = req.body.status;
    let qry = "INSERT INTO ticket SET title= '"+title+"', subject= '"+subject+"', priority = '"+priority+"',department= '"+department+"',user = '"+user+"', action= '"+action+"', status= '"+status+"'  ";
    mysql.query(qry,(err,result)=>{
      if(err){
        throw err
      }
      else{
        res.redirect("/support/add-new-ticket")
      }
    })
  


    //console.log("post received:%s %s", title)
  })


module.exports = router;