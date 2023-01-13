var express = require('express');
var router = express.Router();
const mysql = require("./connection").conn

/* GET users listing. */
router.get('/', function(req, res, next) {
  let sql = "SELECT * FROM refund"
  mysql.query(sql,(err,result)=>{
    if(err)
    throw err
    else{
      res.render('setting', { title: 'Users Page', sampleData: result});
    }
  })
  
});
router.post('/refund/', function(req,res){
  var title= req.body.title;
  var description = req.body.description;
  var metatag = req.body.metatag ;
  var metatitle =  req.body.metatitle;
  var url = req.body.url;
  let sql = "INSERT INTO refund SET title = '"+title+"', description = '"+description+"', metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"' "
  mysql.query(sql, (err,result) =>{
    if (err)
    throw err
    else{
      res.redirect('/setting/')
    }
  })
})
router.get('/refund/edit/:id',(req,res) =>{
  var UserId= req.params.id;
  var sql=`SELECT * FROM refund WHERE id=${UserId}`;
  mysql.query(sql, (err,result) =>{
    if(err)
    throw err
    else{
      res.render("setting/form", {title: "new tag form ", sampleData: result})
    }
  });
})
router.post('/refund/edit/:id',function(req,res){
  var id = req.params.id
    var title = req.body.title;
    var description = req.body.description;
    var metatag = req.body.metatag ;
    var metatitle =  req.body.metatitle;
    var url = req.body.url;
    let qry  = "UPDATE refund SET title = '"+title+"', description= '"+description+"', metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"' WHERE id= '"+id+"'"
    mysql.query(qry, (err,result) =>{
      if(err)
      throw err
      else{
        res.redirect("/setting/")
      }
    })

})

router.get('/privacy/', function(req, res, next) {
  let sql =  "SELECT * FROM privacy"
  mysql.query(sql,(err,result) =>{
    if(err)
    throw err
    else{
      res.render('setting/privacy', { title: 'Privacy Policy Page', sampleData:result });
    }
  })
  router.get("/privacy/edit/:id", (req,res) =>{
    var UserId= req.params.id;
    var sql=`SELECT * FROM privacy WHERE id=${UserId}`;
    mysql.query(sql, (err,result) =>{
      if(err)
      throw err
      else{
        res.render("setting/form", {title: "new tag form ", sampleData: result})
      }
    });
  })
  router.post('/privacy/edit/:id', function(req,res){
    var id = req.params.id
    var name = req.body.name;
    var description = req.body.description ;
    var metatitle =  req.body.metatitle;
    var url = req.body.url;
    let qry  = "UPDATE privacy SET name = '"+name+"', description= '"+description+"', metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"' WHERE id= '"+id+"'"
    mysql.query(qry, (err,result) =>{
      if(err)
      throw err
      else{
        res.redirect("/setting/privacy")
      }
    })
  })

});
router.post('/privacy/', function(req,res) {
  var title = req.body.title;
  var description =  req.body.description;
  var metatag = req.body.metatag;
  var metatitle =  req.body.metatitle;
  var url = req.body.url;
  let sql =  "INSERT INTO privacy SET title= '"+title+"', description = '"+description+"', metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"'   "
  mysql.query(sql,(err,result) =>{
    if(err)
      throw err
      else{
        res.redirect("/setting/privacy/")
      }

  })
})
router.get('/about1/', function(req, res, next) {
  let sql =  "SELECT * FROM contact"
  mysql.query(sql,(err,result) =>{
    if(err)
    throw err
    else{
      res.render('setting/about1', { title: 'about us Policy Page', sampleData:result });
    }
  })
})
router.get("/about1/edit/:id", (req,res) =>{
  var UserId= req.params.id;
  var sql=`SELECT * FROM contact WHERE id=${UserId}`;
  mysql.query(sql, (err,result) =>{
    if(err)
    throw err
    else{
      res.render("setting/form", {title: "new tag form ", sampleData: result})
    }
  });
})
router.post('/about1/', function(req,res) {
  var title = req.body.title;
  var description =  req.body.description;
  var metatag = req.body.metatag;
  var metatitle =  req.body.metatitle;
  var url = req.body.url;
  let sql =  "INSERT INTO contact SET title= '"+title+"', description = '"+description+"',metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"'"
  mysql.query(sql,(err,result) =>{
    if(err)
      throw err
      else{
        res.redirect("/setting/about1")
      }

  })
})

router.post('/about1/edit/:id', function(req,res){
  var id = req.params.id
  var name = req.body.name;
  var description = req.body.description ;
  var metatitle =  req.body.metatitle;
  var url = req.body.url;
  let qry  = "UPDATE contact SET name = '"+name+"', description= '"+description+"', metatag= '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"' WHERE id= '"+id+"'"
  mysql.query(qry, (err,result) =>{
    if(err)
    throw err
    else{
      res.redirect("/setting/about1")
    }
  })
})

router.get('/tags/', function(req, res, next) {

  let qry =  "SELECT * FROM tag";
  mysql.query(qry, function(err,result){
    if(err){
      throw err
    }
    else{          
      res.render('setting/tags', { title: 'Privacy Policy Page' ,sampleData:result});
      }
  })
});
// router.get('/tags/edit/:id', function(req,res) {
//   var id = req.params.id;
//   let qry = `SELECT * FROM tag WHERE id = ${id}`
//   mysql.query(qry, (err,result)=>{
//     if(err)
//     throw err
//     else{
//       res.render('updatetag',{title: "updatetag", sampleData:result})
//     }
//   })
// })

router.get("/tags/delete/:id", function(req,res){
  var id= req.params.id;
  // console.log(id);
    var sql = `DELETE FROM tag WHERE id = '${id}' `;
    mysql.query(sql, function(err,result){
      if(err)
      throw err
      else{
        res.redirect("/setting/tags/")
      }
    })
})

router.get("/tags/edit/:id", (req,res) => {
  var UserId= req.params.id;
      var sql=`SELECT * FROM tag WHERE id=${UserId}`;
      mysql.query(sql, (err,result) =>{
        if(err)
        throw err
        else{
          res.render("setting/form", {title: "new tag form ", sampleData: result})
        }
      });
});

router.post("/tags/edit/:id", (req,res) => {
  var id = req.params.id
  var title = req.body.title;
  var description = req.body.description
  var metatag = req.body.metatag;
  var metatitle =  req.body.metatitle;
  var url =  req.body.title; 
  let qry  = "UPDATE tag SET title = '"+title+"', description= '"+description+"', metatag = '"+metatag+"', metatitle= '"+metatitle+"', url = '"+url+"' WHERE id= '"+id+"'"
  mysql.query(qry, (err,result) =>{
    if(err)
    throw err
  })
  res.redirect("/setting/tags/")
})

router.post("/tags/", function(req,res){
  var title = req.body.title;
  var description = req.body.description;
  var metatag = req.body.metatag;
  var metatitle =  req.body.metatitle;
  var url =  req.body.title; 
  let qry = "INSERT INTO tag SET title= '"+title+"', description= '"+description+"', metatag='"+metatag+"',metatitle = '"+metatitle+"', url= '"+url+"' ";
  mysql.query(qry, (err,result) => {
    if(err)
    throw err
    else{
      // res.send(result)
        res.redirect("/setting/tags/")
    }
  }) 
} )

router.get("/footer/edit/:id", (req,res) => {
  var UserId= req.params.id;
      var sql=`SELECT * FROM footer WHERE id=${UserId}`;
      mysql.query(sql, (err,result) =>{
        if(err)
        throw err
        else{
          res.render("setting/updatefooter", {title: "new tag form ", sampleData: result})
        }
      });
});
router.post("/footer/edit/:id", (req,res) => {
  var id = req.params.id
  var description = req.body.description;
  let  qry =  "UPDATE footer SET description= '"+description+"' WHERE id = '"+id+"'"
  mysql.query(qry,(err,result) =>{
    if(err)
    throw err
    else{
      res.redirect("/setting/footer/")
    }
  })
})

router.get('/footer/', (req,res) => {
  let qry = "SELECT * FROM footer";
  mysql.query(qry,(err,result) =>{
    if(err)
    throw err
    else{
      res.render("setting/footer",{title: "footer description page ", sampleData:result})
    }
  })
  
})

router.post('/footer/', (req,res) => {
  var description = req.body.description;
  let  qry =  "INSERT INTO footer SET description= '"+description+"'"
  mysql.query(qry,(err,result) =>{
    if(err)
    throw err
    else{
      res.redirect("/setting/footer/")
    }
  })
})




router.get('/shipping/', function(req, res, next) {
  let qry =  "SELECT * FROM shipping";
  mysql.query(qry, function(err,result){
    if(err){
      throw err
    }
    else{

      res.render('setting/shipping', { title: 'Privacy Policy Page',  sampleData: result });
    }
});
});


router.get("/shipping/delete/:id", function(req,res){
  var id= req.params.id;
  // console.log(id);
    var sql = `DELETE FROM shipping WHERE id = '${id}' `;
    mysql.query(sql, function(err,result){
      if(err)
      throw err
      else{
        res.redirect("/setting/shipping/")
      }
    });
});


router.get("/shipping/edit/:id", (req,res) => {
  var UserId= req.params.id;
      var sql=`SELECT * FROM shipping WHERE id=${UserId}`;
      mysql.query(sql, (err,result) =>{
        if(err)
        throw err
        else{
          res.render("setting/form", {title: "new tag form ", sampleData: result})
        }
      });
});

router.post("/shipping/edit/:id", (req,res) => {
  var id = req.params.id
  var title = req.body.title;
  var description = req.body.description
  let qry  = "UPDATE shipping SET title = '"+title+"', description= '"+description+"' WHERE id= '"+id+"'"
  mysql.query(qry, (err,result) =>{
    if(err)
    throw err
  })
  res.redirect("/setting/shipping/")
})



router.post("/shipping/", function(req,res){
  var title = req.body.title;
  var description =  req.body.description
  let qry = "INSERT INTO shipping SET title= '"+title+"', description =  '"+description+"'";
  mysql.query(qry, (err,result) => {
    if(err)
    throw err
    else{
      // res.send(result)
        res.redirect("/setting/shipping/")
    }
  }) 
} )

module.exports = router;