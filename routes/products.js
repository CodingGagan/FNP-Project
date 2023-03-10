var express = require('express');
var router = express.Router();
const multer = require("multer")
const mysql = require("./connection").conn
/* GET users listing. */

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../public")
  },
  filename: (req, file, cb) => {
    //  console .log(cb)
    cb(null, Date.now() + path.extname(file.originalname))
  }
})

router.post('/save/feature/', function (req, res) {
  let qry = "INSERT INTO feature_product (feature_id, product_id) VALUES ('" + req.body.feature_id + "' , '" + req.body.product_id + "')";
  mysql.query(qry, async (err, result) => {
    if (err)
      throw err
    else {
      return res.json([true, "Inserted"]);
    }
  })
})

// console.log(storage);
const upload = multer({ storage: storage })
router.get('/', function (req, res, next) {
  // let qry = "SELECT * FROM   addnewproduct"
  // let qry = "SELECT category.name as category_name, addnewproduct.* FROM addnewproduct LEFT JOIN category ON addnewproduct.category = category.id;"
  let qry = `SELECT category.name as category_name, ft.id as feature_id, ft.name as feature_name, addnewproduct.* FROM addnewproduct
  LEFT JOIN feature_product fp on fp.product_id = addnewproduct.id
  LEFT JOIN feature_type ft on ft.id = fp.feature_id
  LEFT JOIN category ON addnewproduct.category = category.id;`;
  let featureTable = "SELECT * FROM feature_type"
  mysql.query(featureTable, (err, data) => {
    let allFeature = data;
    mysql.query(qry, (err, result) => {
      if (err)

        throw err
      else {
        console.log(result, "pppppppp11111111")
        res.render('products', { title: 'Product Categories Page', sampleData: result, allFeature });
      }
    })
  })
})


// router.get('/view/:id', (req,res) =>{
//   var id =  req.params.id;
//   var image = result[0].image;
//   let qry = `SELECT * FROM   addnewproduct  WHERE id = ${id} `
//   mysql.query(qry,(err,result) =>{
//     if(err)
//     throw err
//     else {
//       var image = result[0].image;
//       let sql = "INSERT INTO addnewproduct SET image = '"+image+"' ";
//       mysql.query(sql,(err,result) =>{
//         if(err)
//         throw err
//         else{
//           editcategorydata = result;
//           res.render("products/viewform", {editcategorydata: result})
//         }
//       })


//     }
//   })
// })
// router.get ('/categories/edit/id',(req,res) =>{
//   var id =req.params.id;
//   var name = req.body.name;
//   let qry =  "UPDATE category SET name = '"+name+"'WHERE id = '"+id+"' ";
//   mysql.qry(qry, (err,result) => {
//     console.log(qry)
//       if(err)
//       throw err
//       else{
//            res.render('products/subcategories', { title: 'Product Subcategory Page', subcategory:result })
//       }
//   })

// })
router.get('/view/:id', function (req, res, next) {

  let category, editcategorydata, subcategory, filter, attribute, atr;
  var id = req.params.id;

  let cql = "SELECT * FROM category";
  let sl = "SELECT * FROM subcategory"
  let fl = "SELECT * FROM filtertype";
  let ps = "SELECT * FROM addattribute  WHERE title = 'color'";
  let ptr = "SELECT * FROM addattribute WHERE title = 'size'";
  let sql = `SELECT * FROM addnewproduct WHERE id = '${id}'`;

  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      editcategorydata = result;
      // console.log(editcategorydata)
      mysql.query(cql, (err, result) => {
        if (err)
          throw err
        else {
          category = result
          //console.log(category)

          mysql.query(sl, (err, result) => {
            if (err)
              throw err
            else {
              subcategory = result;
              mysql.query(fl, (err, result) => {
                if (err)
                  throw err
                else {
                  filter = result
                  mysql.query(ps, (err, result) => {
                    if (err)
                      throw err
                    else {
                      attribute = result;
                      mysql.query(ptr, (err, result) => {
                        if (err)
                          throw err
                        else {
                          atr = result;
                          res.render('products/viewform', { title: "edit page", filter, subcategory, category, editcategorydata, attribute, atr })
                        }
                      })

                    }
                  })

                }
              })

            }
          })

        }
      })

    }
  })
})

// router.get('/bestselling/',(req,res) => {
//   var id =  req.params.id
// })

// router.post('/bestselling/',(req,res) =>{
// let id = req.params.id
// let qry =`SELECT * FROM addnewproduct WHERE id = ${id}`
// mysql.query(qry,(err,result) => {
//   if(err)
//   throw err
//   else{

//     let name = result[0].name
//     let category = result[0].category;
//     let psku = result[0].psku;
//     let quantity =  result[0].quantity;
//     let regularprice = result[0].regularprice;
//     let salesprice =  result[0].salesprice;
//     let status = result[0].status;
//     var image = result[0].image;
//     var stock = result[0].stock;
//     let bestsellingData =  "INSERT INTO bestselling SET stock = '" + stock + "',quantity= '"+quantity+"', image= '" + image + "', name = '" + name + "', category = '" + category + "',psku= '" + psku + "', regularprice= '" + regularprice + "', status= '" + status + "',salesprice= '"+salesprice+"' "
//     mysql.query(bestsellingData,(err,result) => {
//       if(err)
//       throw err
//       else{
//         console.log(result)
//       }
//     })

//   }
// })

// // let id =  result[0].id
// console.log(qry)
// // console.log(qry)
// })




router.get('/copy/:id', upload.single("image"), function (req, res, next) {
  var id = req.params.id;
  let qry = `SELECT * FROM   addnewproduct  WHERE id = ${id} `
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      //  console.log(result)
      // res.redirect("/products")
      let id = req.params.id
      let category = result[0].category;
      let psku = result[0].psku;
      let quantity = result[0].quantity;
      let regularprice = result[0].regularprice;
      let salesprice = result[0].salesprice;
      let status = result[0].status;
      var image = result[0].image;
      var stock = result[0].stock;
      // var image = '/images/'+req.body.image;
      let sql = "INSERT INTO addnewproduct SET stock = '" + stock + "',quantity= '" + quantity + "', image= '" + image + "', name = '" + name + "', category = '" + category + "',psku= '" + psku + "', regularprice= '" + regularprice + "', status= '" + status + "',salesprice= '" + salesprice + "'  id = '" + id + "'"
      mysql.query(sql, (err, result) => {
        if (err)
          throw err
        else {
          res.redirect('/products')
        }
      })
      //console.log(status);
      // console.log(result)


    }
  })
})


router.get('/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM addnewproduct WHERE id = '${id}' `;
  // console.log(sql)
  mysql.query(sql, function (err, data) {
    if (err) {
      throw err;
      // console.log(err);
    }
    else {
      //  res.send(data);
      res.redirect('/products');
    }
  });
});

// router.get('/edit/:id', function (req, res, next) {

//   let subcategories, categories, filter;
//   var id = req.params.id;

//   let qry = "SELECT * FROM category";
//   let sql = "SELECT * FROM subcategory";
//   let ql = ` SELECT * FROM addnewproduct WHERE id = '${id}'`;
//   mysql.query(ql, (err, result) => {
//     if (err)
//       throw err
//     else {
//       categories = result
//       mysql.query(sql, (err, result) => {
//         if (err)
//           throw err
//         else {
//           subcategories = result
//           mysql.query(ql, (err, result) => {
//             if (err)
//               throw err
//             else {
//               filter = result;
//               res.render('products/updateproducts', { title: 'add new product  Page', subcategories, categories, filter });
//             }
//           })
//         }
//       })
//     }
//   })
// })

router.get('/edit/:id', (req, res) => {

  let category, editcategorydata, subcategory, filter, attribute, addatr;
  var id = req.params.id;

  let cql = "SELECT * FROM category";
  let sl = "SELECT * FROM subcategory"
  let fl = "SELECT * FROM filtertype"
  let ps = "SELECT * FROM addattribute  WHERE title = 'color'";
  let ptr = "SELECT * FROM addattribute WHERE title = 'size'";
  let sql = `SELECT * FROM addnewproduct WHERE id = '${id}'`;

  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      editcategorydata = result;
      // console.log(editcategorydata)
      mysql.query(cql, (err, result) => {
        if (err)
          throw err
        else {
          category = result
          //console.log(category)

          mysql.query(sl, (err, result) => {
            if (err)
              throw err
            else {
              subcategory = result;
              mysql.query(fl, (err, result) => {
                if (err)
                  throw err
                else {
                  filter = result;
                  mysql.query(ps, (err, result) => {
                    if (err)
                      throw err
                    else {
                      attribute = result;
                      mysql.query(ptr, (err, result) => {
                        if (err)
                          throw err
                        else {
                          addatr = result
                          res.render('products/updateproducts', { title: "edit page", filter, subcategory, category, editcategorydata, attribute, addatr })
                        }
                      })
                    }
                  })

                }
              })

            }
          })

        }
      })

    }
  })
})
router.get('/bestselling/:id', (req, res) => {
  var id = req.params.id;
  let sql = `SELECT * FROM addnewproduct WHERE id =  '${id}'`
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      console.log(result)
    }
  })

})

router.post('/bestselling/', (req, res) => {
  var id = req.params.id;
  console.log(id, "jjjjj")
  res.redirect("/products")
})



router.post('/edit/:id', upload.single("image"), function (req, res, next) {
  var id = req.params.id;
  var name = req.body.name;
  var slug = req.body.slug;
  var summary = req.body.summary;
  var price = req.body.price;
  var tags = req.body.tags;
  var tagdescription = req.body.tagdescription;
  var deliveryinfo = req.body.deliveryinfo;
  var carins = req.body.carins;
  var psku = req.body.psku;
  var stock = req.body.stock;
  var regularprice = req.body.regularprice;
  var salesprice = req.body.salesprice;
  var quantity = req.body.quantity;
  var minquantity = req.body.minquantity;
  var stock = req.body.stock;
  var attributes = req.body.attributes;
  //var category= req.body.category
  var subcategory = req.body.subcategory;
  var filtertype = req.body.filtertype;

  var sortorder = req.body.sortorder;
  var status = req.body.status;
  var sql = "UPDATE addnewproduct SET name= '" + name + "',price = '" + price + "',summary = '" + summary + "', slug = '" + slug + "',tags= '" + tags + "', tagdescription = '" + tagdescription + "',deliveryinfo= '" + deliveryinfo + "', carins= '" + carins + "',psku= '" + psku + "', stock = '" + stock + "',regularprice= '" + regularprice + "',salesprice= '" + salesprice + "', quantity = '" + quantity + "',minquantity = '" + minquantity + "', attributes= '" + attributes + "', subcategory = '" + subcategory + "', filtertype= '" + filtertype + "',  sortorder = '" + sortorder + "', status = '" + status + "' WHERE id = '" + id + "'";
  // let qry = "SELECT  *  FROM filtertype ";";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
  })
  res.redirect("/products")
})


router.get('/add-new-product/', function (req, res, next) {
  let qry = "SELECT * FROM   addnewproduct"

  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {

      res.render('products/deleteproduct', { title: 'Add New Product Page', sampleData: result });
    }
  })

});
router.get('/add-new-product/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM addnewproduct WHERE id = '${id}' `;
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/products/add-new-product")
      //res.render('products/add-new-product', { title: 'Add New Product Page',sampleData: result });
    }
  })
});
// router.get('/add-new-product/edit/:id', function (req, res, next) {
//   var UserId = req.params.id;

//   var sql = `SELECT * FROM addnewproduct WHERE id=${UserId}`;
//   mysql.query(sql, (err, result) => {
//     if (err)
//       throw err
//     else {
//       //res.redirect("/products/add-new-product")
//       res.render("products/updateproducts", { title: "edit attribute here ", sampleData: result })
//     }
//   })
// });
router.get('/add-new-product/edit/:id', (req, res) => {

  let category, editcategorydata, subcategory, filter, attribute, addatr;
  var id = req.params.id;

  let cql = "SELECT * FROM category";
  let sl = "SELECT * FROM subcategory"
  let fl = "SELECT * FROM filtertype"
  let ps = "SELECT * FROM addattribute  WHERE title = 'color'";
  let ptr = "SELECT * FROM addattribute WHERE title = 'size'";
  let sql = `SELECT * FROM addnewproduct WHERE id = '${id}'`;

  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      editcategorydata = result;
      // console.log(editcategorydata)
      mysql.query(cql, (err, result) => {
        if (err)
          throw err
        else {
          category = result
          //console.log(category)

          mysql.query(sl, (err, result) => {
            if (err)
              throw err
            else {
              subcategory = result;
              mysql.query(fl, (err, result) => {
                if (err)
                  throw err
                else {
                  filter = result
                  mysql.query(ps, (err, result) => {
                    if (err)
                      throw err
                    else {
                      attribute = result
                      mysql.query(ptr, (err, result) => {
                        if (err)
                          throw err
                        else {
                          addatr = result
                          res.render('products/updateproducts', { title: "edit page", filter, subcategory, attribute, addatr, category, editcategorydata })
                        }
                      })
                    }
                  })

                }
              })

            }
          })

        }
      })

    }
  })
})

router.post('/add-new-product', function (req, res, next) {
  let subcategories, categories, filter;
  let qry = "SELECT * FROM category";
  let sql = "SELECT * FROM subcategory";
  let ql = "SELECT * FROM filtertype";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      categories = result
      mysql.query(sql, (err, result) => {
        if (err)
          throw err
        else {
          subcategories = result
          mysql.query(ql, (err, result) => {
            if (err)
              throw err
            else {
              filter = result;
              res.render('products/updateproducts', { title: 'add new product  Page', subcategories, categories, filter });
            }
          })
        }
      })
    }
  })
});






router.post('/add-new-product/edit/:id', function (req, res, next) {
  var id = req.params.id;
  var name = req.body.name;
  var slug = req.body.slug;
  var summary = req.body.summary;
  var price = req.body.price;
  var tags = req.body.tags;
  var tagdescription = req.body.tagdescription;
  var deliveryinfo = req.body.deliveryinfo;
  var carins = req.body.carins;
  var psku = req.body.psku;
  var stock = req.body.stock;
  var regularprice = req.body.regularprice;
  var salesprice = req.body.salesprice;
  var quantity = req.body.quantity;
  var minquantity = req.body.minquantity;
  var stock = req.body.stock;
  var attributes = req.body.attributes;
  var category = req.body.category;
  var subcategory = req.body.subcategory;
  var filtertype = req.body.filtertype;

  var sortorder = req.body.sortorder;
  var status = req.body.status;

  var sql = "UPDATE addnewproduct SET name= '" + name + "',price = '" + price + "', slug = '" + slug + "',tags= '" + tags + "', tagdescription = '" + tagdescription + "',deliveryinfo= '" + deliveryinfo + "', carins= '" + carins + "',psku= '" + psku + "', stock = '" + stock + "',regularprice= '" + regularprice + "',salesprice= '" + salesprice + "', quantity = '" + quantity + "',minquantity = '" + minquantity + "', attributes= '" + attributes + "', category = '" + category + "', subcategory = '" + subcategory + "', filtertype= '" + filtertype + "', sortorder = '" + sortorder + "', status = '" + status + "' WHERE id = '" + id + "'";
  // let qry = "SELECT  *  FROM filtertype ";";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
  })
  res.redirect("/products/add-new-product")
})
router.get('/categories/', function (req, res, next) {
  let qry = "SELECT * FROM category";
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    }
    else {
      res.render('products/categories', { title: 'Product Categories Page', sampleData: result });
    }
  })

});
router.get('/categories/edit/:id', upload.single("image"), function (req, res, next) {
  var UserId = req.params.id;
  var sql = `SELECT * FROM category WHERE id=${UserId}`;
  // console.log(sql)
  mysql.query(sql, function (err, data) {
    if (err) {
      throw err;
    }
    else {
      //  var image = result[0].image
      res.render('products/updateform', { title: 'Product Categories Page', category: data });
    }
  });
})

// router.get('/categories/edit/:id',(req,res) => {
//   var id = req.params.id;
//   let qry = `SELECT * FROM   category  WHERE id = ${id}`
//   mysql.query(qry,(err,result) => {
//     if(err) 
//     throw err
//     else{
//       var image = result[0].image
//       let sql =  "INSERT INTO category SET  image = '"+image+"' ";
//       mysql.query(sql,(err,result) => {
//         if(err)
//         throw err
//         else{
//           res.redirect("/products/category")
//         }
//       }) 
//     }
//   })
// })

router.post('/categories/edit/:id', upload.single("image"), function (req, res, next) {
  var id = req.params.id;
  var name = req.body.name;
  var categorytype = req.body.categorytype;
  var status = req.body.status;

  var description = req.body.description;
  // var image = result[0].image
  var slug = req.body.slug;
  let qry = "UPDATE subcategory SET categorytype = '" + name + "' WHERE id = '" + id + "'"
  var sql = "UPDATE category SET name= '" + name + "',slug= '" + slug + "',description= '" + description + "',  categorytype= '" + categorytype + "',status= '" + status + "' WHERE id= '" + id + "'  ";
  //  console.log(qry)
  mysql.query(sql, function (err, data) {
    if (err) throw err;

    //     console.log(data.affectedRows + " record(s) updated");
    mysql.query(qry, (err, result) => {
      if (err)
        throw err
      else {
        res.redirect("/products/categories")
      }
    })
  })

})

router.get('/categories/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM category WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err) {
      throw err;
      // console.log(err);
    }
    else {
      // res.send(data);
      res.redirect('/products/categories');
    }


  });

});

router.post("/categories", upload.single("image"), function (req, res) {
  var name = req.body.name;
  var categorytype = req.body.categorytype;
  var tags = req.body.tags;
  var description = req.body.description;
  var image = '/images/' + req.body.image;
  var slug = req.body.slug;
  var keywords = req.body.keywords;
  var status = req.body.status;
  // console.log(image  );
  //let q = "INSERT INTO category VALUES (NULL,'','',NULL,'','','') " 
  let qry = "INSERT INTO category SET name= '" + name + "',slug= '" + slug + "', categorytype = '" + categorytype + "',tags= '" + tags + "', description= '" + description + "',image='" + image + "',keywords='" + keywords + "', status= '" + status + "' ";
  mysql.query(qry, async (err, result) => {
    if (err)
      throw err
    else {
      return res.redirect("/products/categories/");
    }
  })
})

router.get('/producttypes/', function (req, res, next) {
  let filterType, categories, subcategories;
  let qry = "SELECT filtertype.*,category.name as category_name,subcategory.name as subcategory_name from filtertype LEFT JOIN category ON filtertype.filtercategory = category.id LEFT JOIN subcategory ON filtertype.filtesubcategoryId = subcategory.id;";
  let sql = "SELECT * FROM category"
  let qr = `SELECT * FROM subcategory`
  // console.log(qr,"rrrrrr")
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    }
    else {
      filterType = result;
      mysql.query(sql, function (err, result) {
        if (err) {
          throw err
        }
        else {
          categories = result;
          mysql.query(qr, (err, result) => {
            if (err)
              throw err
            else {
              subcategories = result
              res.render('products/producttypes', { title: 'Product Subcategory Page', filterType, categories, subcategories });
            }
          })

        }
      })
    }
  })
})


// router.get ('/producttypes/', (req,res) => {
//   let qr = `SELECT * FROM subcategory`
//   console.log(qr)
//   res.render("products/producttypes")
// })


router.get('/producttypes/edit/:id', function (req, res, next) {
  let filterType, categories, subcategories;
  let qry = "SELECT filtertype.*,category.name as category_name,subcategory.name as subcategory_name from filtertype LEFT JOIN category ON filtertype.filtercategory = category.id LEFT JOIN subcategory ON filtertype.filtesubcategoryId = subcategory.id;";
  let sql = "SELECT * FROM category"
  let qr = `SELECT * FROM subcategory`
  // console.log(qr,"rrrrrr")
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    }
    else {
      filterType = result;
      mysql.query(sql, function (err, result) {
        if (err) {
          throw err
        }
        else {
          categories = result;
          mysql.query(qr, (err, result) => {
            if (err)
              throw err
            else {
              subcategories = result
              res.render('products/filtertypes', { title: 'Product Subcategory Page', filterType, categories, subcategories });
            }
          })

        }
      })
    }
  })
})

// router.get("/producttypes/edit/:id", (req,res) =>{
//     let subcategories, categories, filter;
//     let qry = "SELECT * FROM category";
//     let sql = "SELECT * FROM subcategory";
//     let ql = "SELECT filtertype.*,category.name as category_name,subcategory.name as subcategory_name from filtertype LEFT JOIN category ON filtertype.filtercategory = category.id LEFT JOIN subcategory ON filtertype.filtesubcategoryId = subcategory.id;;";
//     mysql.query(qry, (err, result) => {
//       if (err)
//         throw err
//       else {
//         categories = result
//         mysql.query(sql, (err, result) => {
//           if (err)
//             throw err
//           else {
//             subcategories = result
//             mysql.query(ql, (err, result) => {
//               if (err)
//                 throw err
//               else {
//                 filter = result;
//                 res.render('products/filtertypes', { title: 'add new filter  Page', subcategories, categories, filter });
//               }
//             })
//           }
//         })
//       }
//     })
//   })




router.get('/producttypes/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM filtertype WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err) {
      throw err;
      // console.log(err);
    }
    else {
      // res.send(data);
      res.redirect('/products/producttypes');
    }


  });

});








router.post('/producttypes/edit/:id', upload.single("image"), function (req, res, next) {
  var id = req.params.id;
  var name = req.body.name;
  var filtercategory = req.body.filtercategory;
  var filtersubcategory = req.body.filtersubcategory;

  var status = req.body.status;
  var sql = "UPDATE filtertype SET name ='" + name + "', filtercategory= '" + filtercategory + "', filtesubcategoryId= '" + filtersubcategory + "', image = '" + image + "', status= '" + status + "'WHERE id = '" + id + "' ";
  mysql.query(sql, function (err, data) {
    if (err) throw err;
    //     console.log(data.affectedRows + " record(s) updated");

  })
  res.redirect("/products/producttypes")
})




router.post("/producttypes", upload.single("image"), (req, res) => {
  var name = req.body.name;
  var filtercategory = req.body.filtercategory;
  var filtersubcategory = req.body.filtersubcategory;

  var image = '/images/' + req.body.image;
  var status = req.body.status;

  let qry = "INSERT INTO filtertype SET name ='" + name + "', filtercategory= '" + filtercategory + "', filtesubcategoryId= '" + filtersubcategory + "', image = '" + image + "', status= '" + status + "' ";
  // console.log(qry,"rty")
  mysql.query(qry, async (err, result) => {
    if (err) throw err
    else {
      res.redirect("/products/producttypes")
    }
  })
})

router.get('/sub-categories/', function (req, res, next) {
  let subcategory, categories;
  let qry = "SELECT category.name as categorytype, subcategory.* FROM category JOIN subcategory ON category.id = subcategory.categoryId; ";
  let sql = "SELECT * FROM category"
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    } else {
      subcategory = result
      mysql.query(sql, function (err, result) {
        if (err)
          throw err
        else {
          categories = result
          res.render('products/subcategories', { title: 'Product Subcategory Page', subcategory, categories });


        }
      })

    }
  });
})

router.get('/subcategories/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM subcategory WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err) {
      throw err;
      // console.log(err);
    }
    else {
      // res.send(data);
      res.redirect('/products/sub-categories');
    }


  });

});

router.get('/subcategories/edit/:id', function (req, res, next) {
  var UserId = req.params.id;
  let subcategory, categories;
  let qry = `SELECT * FROM subcategory WHERE id =  '${UserId}'`;
  let sql = "SELECT * FROM category"
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    } else {
      subcategory = result
      mysql.query(sql, function (err, result) {
        if (err)
          throw err
        else {
          categories = result
          res.render('products/usub', { title: 'Product Subcategory Page', subcategory, categories });
        }
      })
    }
  });
});

router.post('/subcategories/edit/:id', upload.single("image"), function (req, res, next) {
  var id = req.params.id;
  var name = req.body.name;
  var slug = req.body.slug

  var categorytype = req.body.categorytype;
  var status = req.body.status;

  var sql = "UPDATE subcategory SET name= '" + name + "', slug = '" + slug + "',categoryId= '" + categorytype + "',status= '" + status + "' WHERE id= '" + id + "'  ";
  mysql.query(sql, function (err, data) {
    if (err) throw err;
    //     console.log(data.affectedRows + " record(s) updated");

  })
  res.redirect("/products/sub-categories")
})

router.post("/subcategories", upload.single("image"), (req, res) => {
  // var categoryId = req.params.
  var name = req.body.name;
  var categorytype = req.body.categorytype;
  var sort = req.body.sort;
  var image = '/images/' + req.body.image;
  var status = req.body.status;
  var slug = req.body.slug;

  // console.log(categorytype,"rrrrr")
  let qry = "INSERT INTO subcategory SET name = '" + name + "', slug= '" + slug + "',sort= '" + sort + "', image='" + image + "', status= '" + status + "',categoryId = '" + categorytype + "'  ";
  // console.log(categoryId)
  mysql.query(qry, (err, result) => {
    if (err) throw err
    else {
      res.redirect("/products/sub-categories")
    }
  })
})


/* JAVASCRIPT DATA ROUTES FOR NODEJS ITSELF */
router.get('/fetch-subcategories/', (req, res) => {
  // console.log(req.query.categoryId,"rassss");
  let qry = `SELECT * FROM subcategory WHERE categoryId = '${req.query.categoryId}'`;
  // console.log(qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(result,"rrrrr")
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true });
      }
    }
  })
});
// router.get('/fetch-products/', (req, res) => {
//   let qry = `SELECT * FROM addnewproduct WHERE  name = '${req.query.Id}'`;
//   mysql.query(qry, (err, result) => {
//     if (err)
//       throw err
//     else {
//       if (result == '' || typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "result": result, "status": true })
//       }
//     }
//   })
// });
router.get('/fetch-products/', (req, res) => {
  let qry = `SELECT * FROM addnewproduct WHERE  name = '${req.query.imageId}'`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true })
      }
    }
  })
});

/* API FOR REACTJS/ ANY FRONTEND */

/* 
  ****************************************
        Main Home/Dashboard Page API Route
  ****************************************
*/


/* Dashboard BestSelling Slider */

// router.get('/bestselling_lists/', (req, res) => {
//   req.header("Access-Control-Allow-Origin", "*");
//   let qry = `SELECT * FROM product`;
//   mysql.query(qry, (err, result) => {
//     if (err)
//       throw err
//     else {
//       if (result == '' || typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "result": result, "status": true })
//       }
//     }
//   })
// });
router.get("/cake_gifts/", (req, res) => {
  req.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM category`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true })
      }
    }
  })
})
router.get("/personalized_list/", (req, res) => {
  req.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM subcategory`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true })
      }
    }
  })
})

module.exports = router;
