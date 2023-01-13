var express = require('express');

var router = express.Router();
const mysql = require("./connection").conn
var multer = require("multer");
var shortid = require("shortid");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.dirname(__dirname), "uploade"))
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, shortid.generate() + "-" + file.originalname)
  }
})

const upload = multer({ storage })
router.get('/role-group/', function(req, res, next) {
  let qry =  "SELECT * FROM addrole";
  mysql.query(qry,(err,result) =>{
    if(err)
    throw err
    else{
      res.render('rolemanagement', { title: 'rolemanagement page ',sampleData: result });
    }
  })  
  });
  router.get('/role-group/delete/:id', function(req,res,next) {
    var id = req.params.id;
    // console.log(id);
    var sql = `DELETE FROM addrole WHERE id = '${id}' `;
    mysql.query(sql,(err,result) =>{
      if(err)
      throw err
      else{
        res.redirect("/rolemanagement/role-group")
      }
    })
  })
  router.get('/role-group/edit/:id', function(req,res,next){
    var UserId= req.params.id;
      var sql=`SELECT * FROM addrole WHERE id=${UserId}`;
      mysql.query(sql,(err,result) =>{
        if(err)
        throw err
        else{
          res.render("rolemanagement/updaterole", {title: "update role", sampleData:result})
        }
      })

    
  })

  router.post('/role-group/edit/:id', function(req,res,next) {
    var id = req.params.id;
    var rolegroup =  req.body.rolegroup;
    var status= req.body.status;
    let sql =  "UPDATE addrole SET rolegroup = '"+rolegroup+"', status= '"+status+"' WHERE id = '"+id+"'  "
   mysql.query(sql, (err,result) =>{
    if(err)
      throw err
      else{
        res.redirect("/rolemanagement/role-group")
      }
   })
  })


//   router.get('/role/', function(req, res, next) {
//     res.render('rolemanagement/rolegroup', { title: 'Add New Product Page' });
//   });

  
  router.get('/view-user/', function(req, res, next) {
    let qry =  "SELECT * FROM coustomer";
  mysql.query(qry, function(err,result){
    if(err){
      throw err
    }else{

      res.render('rolemanagement/viewuser', { title: 'Add view user Page',sampleData:result });
    }
  });
  });


  router.get('/viewuser/delete/:id', function(req, res, next){
    var id= req.params.id;
    // console.log(id);
      var sql = `DELETE FROM coustomer WHERE id = '${id}' `;
      mysql.query(sql, function (err, data) {
      if (err){
        // throw err;
        console.log(err);
      } 
      else{
        //res.send(data);
         res.redirect('/rolemanagement/view-user');
      }  
    });
  });

  router.post('/viewuser/edit/:id',upload.single("image"), function(req, res, next){
    var id = req.params.id;
    var image = '/images/'+req.body.image;
    var status = req.body.status;
    var username =  req.body.username;
    var sql =  "UPDATE coustomer SET image= '"+image+"', status= '"+status+"', username= '"+username+"' WHERE id = '"+id+"' "
    mysql.query(sql,function(err,data) {
     if (err) throw err;

    })
    res.redirect("/rolemanagement/view-user")
  })

  router.get('/viewuser/edit/:id', function(req, res, next){
    var UserId= req.params.id;
      var sql=`SELECT * FROM coustomer WHERE id=${UserId}`;
  // console.log(sql)
  mysql.query(sql, function (err, data) {
    if (err){
      // throw err;
      console.log(err);
    } 
    else{
    //  console.log(data)
        res.render('rolemanagement/coustomer', { title: 'Product Categories Page', sampleData:data });
    }    
  });

  })
  // router.get('/addrole/', function(req, res, next) {
  //   res.render('addrole', { title: 'Add view user Page' });
  // });
  router.get('/view-employee/', upload.single("image"), function(req, res, next) {
    let qry  =   "SELECT * FROM employee";
    mysql.query(qry, function(err,result){
      if(err){
        throw err
      }else{
  
        res.render('rolemanagement/viewemployee', { title: 'Product Subcategory Page',sampleData:result });
      }
  });
  });
  router.get('/view-employee/delete/:id', function(req, res, next) {
    let id =  req.params.id;
    let qry  =  `DELETE FROM employee WHERE id = '${id}' `;
    mysql.query(qry, function(err,result){
      if(err){
        throw err
      }else{
        res.redirect("/rolemanagement/view-employee/")
  
        // res.render('rolemanagement/viewemployee', { title: 'Product Subcategory Page',sampleData:result });
      }
  });
  });
  router.get('/view-employee/edit/:id', function(req,res,next){
    var UserId = req.params.id;
  var sql = `SELECT * FROM employee WHERE id=${UserId}`;
  mysql.query(sql,(err,result) =>{
    if(err)
    throw err
    else{
      res.render("rolemanagement/updateemployee", {title:  "update employee details", sampleData:result})
    }
  })
  })
  router.post('/view-employee/edit/:id',upload.single("image"),function(req,res,next){
    // console.log("hello")
    var id = req.params.id;
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password;
    var cpassword = req.body.cpassword;
    var eid = req.body.eid;
    var jdate = req.body.jdate;
    var phoneno = req.body.phoneno;
    var company = req.body.company;
    var department = req.body.department;
    var desigination = req.body.desigination;
    var image = '/images/'+req.body.image;
    var salary = req.body.salary;
    var salaryslip = req.body.salaryslip;
    var role = req.body.role;
    let qry = "UPDATE employee SET role = '"+role+"', firstname= '" + firstname + "', lastname = '" + lastname + "', username= '" + username + "', email= '" + email + "',password = '"+password+"', cpassword = '"+cpassword+"', eid= '"+eid+"', jdate= '"+jdate+"', phoneno = '"+phoneno+"', company= '"+company+"', department = '"+department+"', desigination= '"+desigination+"', image= '"+image+"', salary = '"+salary+"', salaryslip= '"+salaryslip+"' WHERE id = '"+id+"' ";
      mysql.query(qry,(err,result) =>{
        if(err)
        throw err;
        else{
          res.redirect("/rolemanagement/view-employee/")
        }
      })
  })
  


module.exports = router;