var express = require('express');
var router = express.Router();
const mysql = require("./connection").conn
router.get('/', function(req, res, next) {
    let sql =  "SELECT * FROM region"
    mysql.query(sql,(err,result) => {
        if(err)
        throw err
        else{
            res.render('city',{title: "region page ", sampleData: result })
        }
    })
 
    });

    router.post('/', (req,res) => {
        var region =  req.body.region;
        let qry = "INSERT INTO region SET region = '"+region+"'"
        mysql.query(qry, (err,result) => {
            if(err)
            throw err
            else{
                res.redirect('/citymanagement/')
            }
        })

    //    console.log(result)
    })

    router.get('/delete/:id', (req,res) => {
        var id = req.params.id;
        var sql = `DELETE FROM region WHERE id = '${id}' `;
        mysql.query(sql, function(err,result){
          if(err)
          throw err
          else{
            res.redirect("/citymanagement")
          }
        });
    })

    router.get('/edit/:id',(req,res) => {
        var UserId= req.params.id;
        var sql=`SELECT * FROM region WHERE id=${UserId}`;
        mysql.query(sql, (err,result) =>{
          if(err)
          throw err
          else{
            res.render('city/updateregion', {title: "update region ", sampleData:result})
          }
        })
       
    })

    router.post('/edit/:id' ,(req,res) => {
        var id =  req.params.id;
        var region  = req.body.region;
        let qry  = "UPDATE region SET region  = '"+region+"' WHERE id= '"+id+"'"
        mysql.query(qry, (err,result) =>{
          if(err)
          throw err
          else{
            res.redirect('/citymanagement')
          }
        })
       
    })


    router.get('/city/',(req,res) => {
        let region, sampleData;
        let qry =  "SELECT * FROM region "
        let sql  = "SELECT region.region as region_name, city.* FROM region JOIN city ON region.id = city.regionId "
        mysql.query(qry,(err,result) => {
            if(err)
            throw err
            else{
                region = result
                mysql.query(sql,(err,result) => {
                    if(err)
                    throw err
                    else{
                        sampleData = result
                        res.render('city/city',{title:"city", region,sampleData})
                    }
                })
            }
        })


        
    })

    router.post('/city/',(req,res) => {
        var region = req.body.region;
        var city = req.body.city;
        let qry = "INSERT INTO city SET regionId = '"+region+"', city = '"+city+"'"
        mysql.query(qry, (err,result) => {
            if(err)
            throw err
            else{
              res.redirect('/citymanagement/city/')  
            }
        })
    })

    router.get('/city/delete/:id', (req,res) => {
        var id = req.params.id;
        var sql = `DELETE FROM city WHERE id = '${id}' `;
        mysql.query(sql, function(err,result){
          if(err)
          throw err
          else{
            res.redirect("/citymanagement/city")
          }
        });
    })

    router.get('/city/edit/:id', (req,res) =>{
        let region, sampleData;
        var id = req.params.id
        let qry =  "SELECT * FROM region "
        let sql  = `SELECT * FROM city WHERE id = '${id}' `
        mysql.query(qry,(err,result) => {
            if(err)
            throw err
            else{
                region = result
                mysql.query(sql,(err,result) => {
                    if(err)
                    throw err
                    else{
                        sampleData = result
                        res.render('city/updatecity',{title:"city", region,sampleData})
                    }
                })
            }
    })
})

    router.post('/city/edit/:id', (req,res) => {
        var id = req.params.id;
        var region = req.body.region;
        var city =  req.body.city
         let sql = "UPDATE city SET region  = '"+region+"', city = '"+city+"' WHERE id= '"+id+"'"
         mysql.query(sql,(err,result) => {
            if(err)
            throw err
            else{
                res.redirect("/citymanagement/city")
            }
         })
    })


    router.get('/pincode/', (req,res) => {
        let region, city,sampleData;
        
        let qry =  "SELECT * FROM region "
        let sql  = "SELECT * FROM city"
        let ql = "SELECT pincode.*,region.region,city.city FROM pincode LEFT JOIN region ON pincode.regionId = region.id LEFT JOIN city ON pincode.city = city.id ";
        mysql.query(qry,(err,result) => {
            if(err)
            throw err
            else{
                region = result
                mysql.query(sql,(err,result) => {
                    if(err)
                    throw err
                    else{
                        city = result
                        mysql.query(ql,(err,result) => {
                            if(err)
                            throw err
                            else{
                               sampleData = result
                               console.log(result,"yyyyyyyyyyy")
                                res.render('city/pincode',{title:"city", region,city,sampleData})
                            }
                        })
                       
                    }
                })
            }
    })            
    })

    router.get ('/pincode/delete/:id',(req,res) => {
        var id = req.params.id;
        var sql = `DELETE FROM pincode WHERE id = '${id}' `;
        mysql.query(sql, function(err,result){
          if(err)
          throw err
          else{
            res.redirect("/citymanagement/pincode/")
          }
        });
    })

    router.get ('/pincode/edit/:id', (req,res) => {
        let region, city,sampleData;
       
        let qry =  "SELECT * FROM region "
        let sql  = "SELECT * FROM city"
        let ql = `SELECT pincode.*,region.region,city.city FROM pincode LEFT JOIN region ON pincode.regionId = region.id LEFT JOIN city ON pincode.city = city.id `
        mysql.query(qry,(err,result) => {
            if(err)
            throw err
            else{
                region = result
                mysql.query(sql,(err,result) => {
                    if(err)
                    throw err
                    else{
                        city = result
                        mysql.query(ql,(err,result) => {
                            if(err)
                            throw err
                            else{
                               sampleData = result
                                res.render('city/updatepincode',{title:"city", region,city,sampleData})
                            }
                        })
                       
                    }
                })
            }
    })            

    })
    router.post('/pincode/edit/:id',(req,res) => {
        var id =  req.params.id
        var region =  req.body.region;
        var city = req.body.city
        var pincode = req.body.pincode;
        let sql =  "UPDATE pincode SET region  = '"+region+"', city = '"+city+"',pincode= '"+pincode+"' WHERE id= '"+id+"'";
        mysql.query(sql,(err,result) => {
            if(err)
            throw err
            else{
                res.redirect("/citymanagement/pincode")
            }
        })
    })
    router.post('/pincode/', (req,res) => {
        var region  = req.body.region;
        var city = req.body.city;
        var pincode = req.body.pincode;
        let sql = "INSERT INTO pincode SET regionId = '"+region+"', city= '"+city+"', pincode= '"+pincode+"'"
        mysql.query(sql, (err,result) => {
            if(err)
            throw err
            else{
                res.redirect("/citymanagement/pincode")
            }
        })
    })


    router.get('/fetch-citydata/', (req,res) => {
        console.log(req.query.regionId,"55555")
        let qry = `SELECT * FROM city WHERE regionId = '${req.query.regionId}'`;
        console.log(qry,kkkkkk)
        mysql.query(qry, (err, result) => {
          if (err)
            throw err
          else {
            console.log(result,"rrrrr")
            if (result == '' || typeof result == undefined || !result) {
              res.json({ "result": "No data found", "status": false })
            } else {
               res.json({ "result": result, "status": true });
            }
          }
        })
    })


    module.exports = router;
