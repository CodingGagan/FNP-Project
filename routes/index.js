var express = require('express');
var router = express.Router();
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


const mysql = require("./connection").conn


/* GET home page. */
router.get('/', upload.array("image"), function (req, res, next) {
  res.render('index', { title: 'Home Page' });
});
router.post("/dashboard", upload.array("image"), function (req, res) {
  var email = req.body.email;
  var password = req.body.password;
  let qry = "INSERT INTO form SET email= '" + email + "', password = '" + password + "' ";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/dashboard");
    }
  })
})


router.get('/about/', upload.single("image"), function (req, res, next) {
  let qry = "SELECT * FROM aboutus"
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render('about', { title: 'About Page', sampleData: result });
    }
  })

});

router.get('/attributes/', function (req, res, next) {
  let qry = "SELECT * FROM addattribute";
  mysql.query(qry, function (err, result) {
    if (err) {
      throw err
    } else {
      res.render('attributes', { title: 'Attributes Page', sampleData: result });
    }
  })
});

router.get('/attributes/delete/:id', function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM addattribute WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err)
      throw err
    else {
      res.redirect("/attributes");
    }
  })
})
router.get("/attributes/edit/:id", (req, res, next) => {
  var UserId = req.params.id;
  var sql = `SELECT * FROM addattribute WHERE id=${UserId}`;
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render("attributeform", { title: "edit attribute here ", sampleData: result })
    }
  })
})
router.post("/attributes/edit/:id", (req, res, next) => {
  var id = req.params.id;
  var terms = req.body.terms;
  var price = req.body.price;
  var title = req.body.title;

  var sql = "UPDATE addattribute SET terms = '" + terms + "', price = '" + price + "', title= '" + title + "' WHERE id = '" + id + "' "
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
  })
  res.redirect("/attributes")

})




router.get('/addattributes/', function (req, res, next) {
  res.render('addattributes', { title: 'Order Log Page' });
});
router.post("/attribute", function (req, res) {
  // var size = req.body.size;
  var terms = req.body.terms;
  var price = req.body.price;
  // var sprice = req.body.price;
  var title = req.body.title;
  var image = '/images/' + req.body.image;
  // var stitle = req.body.stitle;

  let qry = "INSERT INTO addattribute SET  image= '" + image + "', title = '" + title + "', terms = '" + terms + "', price = '" + price + "' ";
  mysql.query(qry, (err, result) => {
    if (err) {
      throw err
    } else {
      res.redirect("/addattributes")
    }
  })
  //console.log("post received:%s %s", size)
})

router.get('/dashboard/', function (req, res, next) {
  res.render('dashboard', { title: 'dashboard page' })
})

router.get('/orderLog/', function (req, res, next) {
  let qry = "SELECT * FROM addorder";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      //console.log(result)
      res.render('orderlog', { title: 'Order Log Page', sampleData: result });
    }
  })
});

router.get('/vender/', function (req, res, next) {
  res.render('vender', { title: 'vender  Page' });
});
router.get('/inventory/', function (req, res, next) {
  res.render('inventory', { title: 'sales Page' });
});
router.get('/sales/', function (req, res, next) {
  res.render('sales', { title: 'sales  Page' });
});

router.get('/addnewproduct/', function (req, res, next) {
  let subcategories, categories, filter, attribute, atr;
  let qry = "SELECT * FROM category";
  let sql = "SELECT * FROM subcategory";
  let ql = "SELECT * FROM filtertype";
  let ps = "SELECT * FROM addattribute  WHERE title = 'color'";
  let ptr = "SELECT * FROM addattribute WHERE title = 'size'";
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
              mysql.query(ps, (err, result) => {
                if (err)
                  throw err;
                else {
                  attribute = result
                  mysql.query(ptr, (err, result) => {
                    if (err)
                      throw err
                    else {
                      addatr = result;
                      //console.log(result)
                      res.render('addnewproduct', { title: 'add new product  Page', subcategories, categories, filter, attribute, atr });
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
});
// router.get("/addnewproduct/product", function(req,res) {
//   let qry = "SELECT * FROM addnewproduct  "
//   mysql.query(qry,async(err,result) =>{
//     if(err) {throw err;}
//     else{

//       return res.render("/index" ,{data:result})
//     }

//   })
// })
router.post("/addnewproduct", upload.single("image"), (req, res) => {
  let categories;
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
  var image = '/images/' + req.body.image;
  var image1 = '/images/' + req.body.image1;
  var image2 = '/images/' + req.body.image2;
  var image3 = '/images/' + req.body.image3;
  var image4 = '/images/' + req.body.image4;
  var image5 = '/images/' + req.body.image5;
  var aimage = '/images/' + req.body.aimage;
  var simage = '/images/' + req.body.simage;
  var aprice = req.body.aprice;

  var acolor = req.body.acolor;
  var sprice = req.body.sprice;
  var asize = req.body.asize;
  var sortorder = req.body.sortorder;
  var status = req.body.status;
  let filterType;
  // let sql = "SELECT * FROM category"
  let qry = "INSERT INTO addnewproduct SET name= '" + name + "',price = '" + price + "', slug = '" + slug + "',tags= '" + tags + "', tagdescription = '" + tagdescription + "',deliveryinfo= '" + deliveryinfo + "', carins= '" + carins + "',psku= '" + psku + "', stock = '" + stock + "',regularprice= '" + regularprice + "',salesprice= '" + salesprice + "', quantity = '" + quantity + "',minquantity = '" + minquantity + "', attributes= '" + attributes + "', category = '" + category + "', subcategoryID = '" + subcategory + "', filtertype= '" + filtertype + "', image = '" + image + "',image1 = '" + image1 + "', image2 = '" + image2 + "',image3 = '" + image3 + "', image4 ='" + image4 + "', image5= '" + image5 + "', sortorder = '" + sortorder + "', status = '" + status + "', aprice = '" + aprice + "', sprice = '" + sprice + "', acolor= '" + acolor + "', asize = '" + asize + "'";
  // let qry = "SELECT  *  FROM filtertype ";
  // let sql = "SELECT * FROM category"
  mysql.query(qry, (err, result) => {
    if (err) {

      throw err
    }
    else {

      res.redirect('/addnewproduct')
    }

  })
})

router.get('/addnewcomplaint/', function (req, res, next) {
  res.render('addnewcomplaint', { title: 'add new complaint  Page' });
});

router.get('/coupon/', function (req, res, next) {
  let qry = "SELECT * FROM coupon";
  mysql.query(qry, function (err, result) {
    if (err)
      throw err
    else {
      res.render('coupon', { title: 'coupon  Page', sampleData: result });
    }
  })
});
router.get("/coupon/delete/:id", function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM coupon WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err)
      throw err
    else {
      res.redirect("/coupon");
    }
  })
})

router.get("/coupon/edit/:id", function (req, res, next) {
  var UserId = req.params.id;
  var sql = `SELECT * FROM coupon WHERE id=${UserId}`;
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
    else {
      res.render("couponcode", { title: 'couponcode Page', sampleData: result })
    }
  })

});

router.post("/coupon/edit/:id", function (req, res, next) {
  var id = req.params.id
  var code = req.body.code;
  var discounton = req.body.discounton;
  var discount = req.body.discount;
  var discounttype = req.body.discounttype;
  var expiry = req.body.expiry;
  var status = req.body.status

  var sql = "UPDATE coupon SET code = '" + code + "', discounton = '" + discounton + "', discounttype= '" + discounttype + "', expiry = '" + expiry + "', status = '" + status + "', discount = '" + discount + "' WHERE id = '" + id + "' "
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
  })
  res.redirect("/coupon");
})


router.post("/coupon", (req, res) => {
  var title = req.body.title;
  var code = req.body.code;
  var discounton = req.body.discounton;
  var discount = req.body.discount;
  var discounttype = req.body.discounttype;
  var expiry = req.body.expiry;
  var status = req.body.status
  var fixed = req.body.fixed;
  var percentage = req.body.percentage;
  //console.log(discounttype)
  let qry = '';
  if (discounttype == '1') {
    qry = "INSERT INTO coupon SET percentage = '" + discount + "', title= '" + title + "',expiry= '" + expiry + "', status = '" + status + "', code = '" + code + "',discounton ='" + discounton + "' ";
  }
  else {
    qry = "INSERT INTO coupon SET fixed = '" + discount + "', title= '" + title + "', code = '" + code + "', status= '" + status + "', discounttype = '" + discounttype + "', expiry = '" + expiry + "' ";

  }

  mysql.query(qry, (err, result) => {

    if (err)
      throw err
    else {
      res.redirect("/coupon")
    }

  })

  // console.log("post received:%s %s", title)
})



router.get('/complaint/', function (req, res, next) {
  let qry = "SELECT * FROM complaint";
  mysql.query(qry, function (err, result) {
    if (err)
      throw err
    else {
      res.render('complaint', { title: 'complaint  Page', sampleData: result });
    }
  })
});

router.post("/complaint", upload.single("image"), function (req, res, next) {
  var orderno = req.body.orderno;
  var complaintno = req.body.complaintno;
  var complainttype = req.body.complainttype;
  var createdon = req.body.createdon;
  var resolveon = req.body.resolveon;
  var vendorname = req.body.vendorname;
  var assigned = req.body.assigned;
  var image = '/images/' + req.body.image;
  var status = req.body.status;
  let sql = "INSERT INTO complaint SET orderno = '" + orderno + "', complaintno = '" + complaintno + "',complainttype= '" + complainttype + "', createdon = '" + createdon + "', resolveon = '" + resolveon + "', vendorname= '" + vendorname + "', assigned= '" + assigned + "',image= '" + image + "', status= '" + status + "' ";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/addnewcomplaint")
    }
  })


  // console.log("post received:%s %s", orderno)
})
router.get('/addrole/', function (req, res, next) {
  res.render('addrole', { title: 'coupon  Page' });
});

router.post('/addrole', function (req, res, next) {
  var rolegroup = req.body.rolegroup;
  var status = req.body.status;
  let qry = "INSERT INTO addrole SET rolegroup = '" + rolegroup + "', status= '" + status + "'   ";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      //console.log(result);
      res.redirect("rolemanagement/role-group/")
    }
  })
})
router.get('/blog-page-setting/delete/:id', (req, res) => {
  var id = req.params.id
  var sql = `DELETE FROM blogpage WHERE id = '${id}' `;
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
    else {
      // console.log(result)
      res.redirect("/blog-page-setting")
      // res.redirect("/coupon");
    }
  })

})
router.get('/blog-page-setting/', function (req, res, next) {

  let sql = "SELECT * FROM blogpage";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {

      res.render('blogpagesetting', { title: 'add new blog page setting  Page', sampleData: result });
    }
  })
});
router.post('/blog-page-setting/', function (req, res, next) {
  var blogpage = req.body.blogpage
  let qry = "INSERT INTO blogpage SET blogpage = '" + blogpage + "'";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/blog-page-setting")
    }
  })
  //console.log("post received:%s %s", blogpage)
})
router.get('/blog-single-setting/', function (req, res, next) {
  res.render('blogsinglepagesetting', { title: 'add new blog  single page setting  Page' });
});
router.get('/addblogpost/', function (req, res, next) {
  let qry = "SELECT * FROM blogpage"
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {

      res.render('addblogpost', { title: 'add  blog Post page setting  Page', sampleData: result });
    }
  })
});
router.post('/addblogpost/', upload.single("image"), function (req, res, next) {
  var title = req.body.title;
  var summary = req.body.summary;
  var author = req.body.author;
  var blogtags = req.body.blogtags;
  var slug = req.body.slug;
  var blogpage = req.body.blogpage;
  var ogimage = '/images/' + req.body.ogimage;
  var status = req.body.status;
  var metatags = req.body.metatags;
  var metatitle = req.body.metatitle;
  var metades = req.body.metades;
  var ogmeta = req.body.ogmeta;
  var ogdes = req.body.ogdes;
  var bimage = '/images/' + req.body.bimage;
  // console.log(blogpage)
  let sql = "INSERT INTO blog SET title = '" + title + "', summary = '" + summary + "', author= '" + author + "',blogtags= '" + blogtags + "', slug = '" + slug + "', blogpage = '" + blogpage + "', ogimage= '" + ogimage + "', status= '" + status + "', metatags= '" + metatags + "', metatitle= '" + metatitle + "', metades= '" + metades + "', ogmeta= '" + ogmeta + "', ogdes = '" + ogdes + "', bimage= '" + bimage + "' ";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/addblogpost")
    }
  })
})

router.get('/adduser/', function (req, res, next) {

  res.render('adduser', { title: 'addusers  Page' });
});
router.post("/coustomer", upload.single("image"), (req, res) => {
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var usergroup = req.body.usergroup;
  var username = req.body.username;
  var email = req.body.email;
  var phoneno = req.body.phoneno;
  var alternetno = req.body.alternetno;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var address = req.body.address;
  var city = req.body.city;
  var pincode = req.body.pincode;
  var state = req.body.state
  var country = req.body.country;
  var news = req.body.news;
  var image = '/images/' + req.body.image;
  var status = req.body.status;
  var approved = req.body.approved;
  let qry = "INSERT INTO coustomer SET firstname = '" + firstname + "', lastname = '" + lastname + "', usergroup= '" + usergroup + "',username = '" + username + "', email = '" + email + "',phoneno = '" + phoneno + "',alternetno = '" + alternetno + "', password= '" + password + "', cpassword= '" + cpassword + "', city= '" + city + "',pincode = '" + pincode + "',state= '" + state + "',country = '" + country + "',news= '" + news + "',image= '" + image + "',status= '" + status + "', approved= '" + approved + "'  "
  mysql.query(qry, (err, result) => {
    if (err) {
      throw err
    }
    else {
      res.redirect("/adduser")
    }
  })
})
router.get('/addctype/', function (req, res, next) {
  res.render('addctype', { title: 'addcomplainttype  Page' });
});

router.post("/addnewcomplaint", upload.single("image"), (req, res, next) => {
  var complainttype = req.body.complainttype;
  var createdon = req.body.createdon;
  var resolveon = req.body.resolveon;
  var vendorname = req.body.vendorname;
  var assigned = req.body.assigned;
  var image = '/images/' + req.body.image;
  var status = req.body.status;
  let sql = "INSERT INTO complainttype SET complainttype= '" + complainttype + "', createdon = '" + createdon + "', resolveon = '" + resolveon + "', vendorname= '" + vendorname + "', assigned= '" + assigned + "',image= '" + image + "', status= '" + status + "' ";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/addnewcomplaint")
    }
  })
})

router.get('/faq/', function (req, res, next) {
  let sql = "SELECT * FROM faq"
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render('faq', { title: 'faq  Page', sampleData: result });
    }
  }
  )
});
router.get('/faq/delete/:id', (req, res) => {
  var id = req.params.id
  var sql = `DELETE FROM faq WHERE id = '${id}' `;
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
    else {
      // console.log(result)
      res.redirect("/faq")
      // res.redirect("/coupon");
    }
  })
})


router.get("/faq/edit/:id", (req, res) => {
  var id = req.params.id
  let sql = `SELECT * FROM faq WHERE id = '${id}'`
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render("updatefaq", { title: "update faq page ", sampleData: result })
    }
  })
})

router.get('/addorder/', function (req, res, next) {
  let category, subcategory;
  let mql = "SELECT * FROM category";
  let sql = "SELECT * FROM subcategory"
  mysql.query(mql, (err, result) => {
    if (err)
      throw err
    else {
      category = result;
      mysql.query(sql, (err, result) => {
        if (err)
          throw err
        else {
          subcategory = result
          res.render("addorder", { title: "addorder", category, subcategory })
        }
      })
    }
  })
})

router.post('/addorder', function (req, res, next) {
  // console.log("hello")
  var name = req.body.name
  var email = req.body.email
  var phoneno = req.body.phoneno;
  var alternetno = req.body.alternetno;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var aname = req.body.aname;
  var aphone = req.body.aphone;
  var aphoneno = req.body.aphoneno;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var address3 = req.body.address3;
  var addresstype = req.body.addresstype;
  var haddress = req.body.haddress;
  var oaddress = req.body.oaddress;
  var other = req.body.other;
  var landmark = req.body.landmark;
  var city = req.body.city;
  var pincode = req.body.pincode;
  var date = req.body.date;
  var dtype = req.body.dtype;
  var stime = req.body.stime;
  var occasion = req.body.occasion
  var moc = req.body.moc;
  var mocake = req.body.mocake;
  var ins = req.body.ins;
  var category = req.body.category;
  var subcategory = req.body.subcategory;
  var pname = req.body.pname;
  var pimage = '/images/' + req.body.pimage;
  var des = req.body.des;
  var pprice = req.body.pprice;
  var code = req.body.code;
  var card = req.body.card;
  var total = req.body.total
  //console.log(name)
  let qry = "INSERT INTO addorder SET name = '" + name + "', total = '" + total + "', email = '" + email + "', phoneno= '" + phoneno + "', alternetno = '" + alternetno + "', password = '" + password + "', cpassword = '" + cpassword + "', aname= '" + aname + "',aphone = '" + aphone + "', aphoneno = '" + aphoneno + "', address1 = '" + address1 + "', address2 = '" + address2 + "', address3 = '" + address3 + "', addresstype = '" + addresstype + "', haddress= '" + haddress + "', oaddress = '" + oaddress + "', other = '" + other + "', landmark= '" + landmark + "', city= '" + city + "', pincode= '" + pincode + "', date= '" + date + "', dtype = '" + dtype + "', stime= '" + stime + "', occasion= '" + occasion + "',moc= '" + moc + "', mocake= '" + mocake + "', ins= '" + ins + "', category= '" + category + "', subcategory= '" + subcategory + "', pname = '" + pname + "', pimage= '" + pimage + "', des= '" + des + "', pprice= '" + pprice + "', code= '" + code + "', card= '" + card + "'    ";
  // console.log(qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(name)
      res.redirect("/addorder")
    }
  })
})
router.get('/adddetails/', function (req, res, next) {
  res.render("adddetails", { title: "adddetails page" })
})
router.get('/adddetails/edit/:id', (req, res) => {
  var id = req.params.id
  let sql = `SELECT * FROM aboutus WHERE id = ${id}`
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render("updateabout", { title: "update about", sampleData: result })
    }
  })
})
router.post('/adddetails/edit/:id', function (req, res) {
  var id = req.params.id
  var email = req.body.email;
  var address = req.body.address;
  var phoneno = req.body.phoneno;
  var whatsapp = req.body.whatsapp;
  var website = req.body.website;
  var social = req.body.social;
  var insta = req.body.insta
  var wimage = '/images/' + req.body.wimage;
  var logo = '/images/' + req.body.logo;
  let sql = "UPDATE aboutus SET email = '" + email + "',social = '" + social + "', insta= '" + insta + "', address = '" + address + "', phoneno = '" + phoneno + "', whatsapp = '" + whatsapp + "', website = '" + website + "', wimage = '" + wimage + "', logo = '" + logo + "' WHERE id = '" + id + "'   ";

  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(result)
      res.redirect("/about")
    }
  })
})
router.post('/adddetails/', upload.single("image"), (req, res) => {
  var email = req.body.email;
  var address = req.body.address;
  var phoneno = req.body.phoneno;
  var whatsapp = req.body.whatsapp;
  var website = req.body.website;
  var social = req.body.social;
  var wimage = '/images/' + req.body.wimage;
  var logo = '/images/' + req.body.logo;
  let sql = "INSERT INTO aboutus SET email = '" + email + "',social = '" + social + "', address = '" + address + "', phoneno = '" + phoneno + "', whatsapp = '" + whatsapp + "', website = '" + website + "', wimage = '" + wimage + "', logo = '" + logo + "'";

  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(result)
      res.redirect("/about")
    }
  })
})
// router.get('/fetch-faq', (req,res)=>{
//   let qry = `SELECT * FROM faq WHERE description = '${req.query.titleId}'`;
//   mysql.query(qry,(err,result) =>{
//     if(err)
//     throw err;
//     else{
//       if (result == '' || typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "result": result, "status": true })
//       }
//     }
//   })
// } )
// router.get("/faq/edit/:id", (req,res) =>{
//   let sql = "SELECT * FROM faq"
//   var id = req.params.id
//   let mql = `SELECT * FROM faq WHERE description = '${id}'`
//   mysql.query(sql,(err,result) =>{
//     if(err)
//     throw err
//     else{
//       var description = result[0].description
//       let ps=  "INSERT INRO faq SET description = '"+description+"' ";
//       mysql.query(mql,(err,result) =>{
//         if(err)
//         throw err
//         else{mysql.query(ps,(err,result) =>{
//           if(err)
//           throw err
//           else{
//             res.render("updatefaq", {title:  "update faq page ",sampleData:result})
//           }
//         })

//         }
//       })

//     }
//   })
// })
router.get('/faq/edit/:id', (req, res) => {
  let sql = `SELECT * FROM faq WHERE textarea = '${id}'`
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      var description = result[0].description
      res.render("updatefaq", { sampleData: result })
    }
  })
})
router.post('/faq/edit/:id', (req, res) => {
  var id = req.params.id;
  var title = req.body.title;
  var description = req.body.description;
  var status = req.body.status;
  let sql = "UPDATE faq SET title= '" + title + "', description= '" + description + "', status= '" + status + "' WHERE id = '" + id + "'";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      //console.log(result)
      res.redirect("/faq")
      // res.redirect("/coupon");
    }
  })
})

router.post("/faq", (req, res) => {
  var title = req.body.title;
  var description = req.body.description;
  var status = req.body.status;
  let sql = "INSERT INTO faq SET title = '" + title + "', description= '" + description + "', status= '" + status + "'";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/faq")
    }
  })
})
router.get('/login/', function (req, res, next) {
  res.render('login', { title: 'faq  Page' });
});


router.get('/blog/', function (req, res, next) {
  let qry = "SELECT * FROM blog"
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render('blog', { title: 'blog  Page', sampleData: result });
    }
  })
  router.get('/addblogpost/delete/:id', (req, res) => {
    var id = req.params.id;
    // console.log(id);
    var sql = `DELETE FROM blog WHERE id = '${id}' `;
    mysql.query(sql, function (err, result) {
      if (err)
        throw err
      else {
        // console.log(result)
        res.redirect("/blog")
        // res.redirect("/coupon");
      }
    })
  })

});

router.get('/addblogpost/edit/:id', (req, res) => {
  let sampleData, blog;
  var UserId = req.params.id;
  var sql = `SELECT * FROM blog WHERE id=${UserId}`;
  var mql = "SELECT * FROM blogpage"
  mysql.query(sql, function (err, result) {
    if (err)
      throw err
    else {
      sampleData = result;
      mysql.query(mql, function (err, result) {
        if (err)
          throw err
        else {
          blog = result;
          res.render("updateblog", { title: 'updateblog Page', sampleData, blog })
        }
      })

    }
  })
})
router.post('/addblogpost/edit/:id', (req, res) => {
  var id = req.params.id;
  var title = req.body.title;
  var summary = req.body.summary;
  var author = req.body.author;
  var blogtags = req.body.blogtags;
  var slug = req.body.slug;
  var blogpage = req.body.blogpage;
  var ogimage = '/images/' + req.body.ogimage;
  var status = req.body.status;
  var metatags = req.body.metatags;
  var metatitle = req.body.metatitle;
  var metades = req.body.metades;
  var ogmeta = req.body.ogmeta;
  var ogdes = req.body.ogdes;
  var bimage = '/images/' + req.body.bimage;
  // console.log(blogpage)
  let sql = "UPDATE blog SET title = '" + title + "', summary = '" + summary + "', author= '" + author + "',blogtags= '" + blogtags + "', slug = '" + slug + "', blogpage = '" + blogpage + "', ogimage= '" + ogimage + "', status= '" + status + "', metatags= '" + metatags + "', metatitle= '" + metatitle + "', metades= '" + metades + "', ogmeta= '" + ogmeta + "', ogdes = '" + ogdes + "', bimage= '" + bimage + "' WHERE id = '" + id + "' ";
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/blog")
    }
  })
})
router.get('/addemployee/', function (req, res, next) {
  let qry = "SELECT * FROM addrole"
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render('addemployee', { title: 'add employee Page', sampleData: result });
    }
  })



});

router.post("/employee", upload.single("image"), function (req, res, next) {
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
  var image = '/images/' + req.body.image;
  var salary = req.body.salary;
  var salaryslip = req.body.salaryslip;
  var role = req.body.role;
  let qry = "INSERT INTO employee SET role = '" + role + "', firstname= '" + firstname + "', lastname = '" + lastname + "', username= '" + username + "', email= '" + email + "',password = '" + password + "', cpassword = '" + cpassword + "', eid= '" + eid + "', jdate= '" + jdate + "', phoneno = '" + phoneno + "', company= '" + company + "', department = '" + department + "', desigination= '" + desigination + "', image= '" + image + "', salary = '" + salary + "', salaryslip= '" + salaryslip + "' ";

  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/addemployee")
    }
  })
  // console.log("post received:%s %s", role)

})
router.get('/addorder/', function (req, res, next) {

  let category, subcategory;

  let mql = "SELECT * FROM category";
  let sql = "SELECT * FROM subcategory"
  mysql.query(mql, (err, result) => {
    if (err)
      throw err
    else {
      category = result;
      mysql.query(sql, (err, result) => {
        if (err)
          throw err
        else {
          subcategory = result
          res.render("addorder", { title: "addorder", category, subcategory })
        }
      })
    }
  })


});
router.post('/addorder', function (req, res, next) {
  // console.log("hello")
  var name = req.body.name
  var email = req.body.email
  var phoneno = req.body.phoneno;
  var alternetno = req.body.alternetno;
  var password = req.body.password;
  var cpassword = req.body.cpassword;
  var aname = req.body.aname;
  var aphone = req.body.aphone;
  var aphoneno = req.body.aphoneno;
  var address1 = req.body.address1;
  var address2 = req.body.address2;
  var address3 = req.body.address3;
  var addresstype = req.body.addresstype;
  var haddress = req.body.haddress;
  var oaddress = req.body.oaddress;
  var other = req.body.other;
  var landmark = req.body.landmark;
  var city = req.body.city;
  var pincode = req.body.pincode;
  var date = req.body.date;
  var dtype = req.body.dtype;
  var stime = req.body.stime;
  var occasion = req.body.occasion
  var moc = req.body.moc;
  var mocake = req.body.mocake;
  var ins = req.body.ins;
  var category = req.body.category;
  var subcategory = req.body.subcategory;
  var pname = req.body.pname;
  var pimage = '/images/' + req.body.pimage;
  var des = req.body.des;
  var pprice = req.body.pprice;
  var code = req.body.code;
  var card = req.body.card;
  var total = req.body.total
  //console.log(name)
  let qry = "INSERT INTO addorder SET name = '" + name + "', total = '" + total + "', email = '" + email + "', phoneno= '" + phoneno + "', alternetno = '" + alternetno + "', password = '" + password + "', cpassword = '" + cpassword + "', aname= '" + aname + "',aphone = '" + aphone + "', aphoneno = '" + aphoneno + "', address1 = '" + address1 + "', address2 = '" + address2 + "', address3 = '" + address3 + "', addresstype = '" + addresstype + "', haddress= '" + haddress + "', oaddress = '" + oaddress + "', other = '" + other + "', landmark= '" + landmark + "', city= '" + city + "', pincode= '" + pincode + "', date= '" + date + "', dtype = '" + dtype + "', stime= '" + stime + "', occasion= '" + occasion + "',moc= '" + moc + "', mocake= '" + mocake + "', ins= '" + ins + "', category= '" + category + "', subcategory= '" + subcategory + "', pname = '" + pname + "', pimage= '" + pimage + "', des= '" + des + "', pprice= '" + pprice + "', code= '" + code + "', card= '" + card + "'    ";
  // console.log(qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(name)
      res.redirect("/addorder")
    }
  })
})
router.get("/orderlog/delete/:id", function (req, res, next) {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM addorder WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err)
      throw err
    else {
      res.redirect("/orderlog");
    }
  })
});


router.get("/orderlog/copy/:id", function (req, res, next) {

  var id = req.params.id;
  let qry = `SELECT * FROM   addorder  WHERE id = ${id} `
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      let name = result[0].name
      let phoneno = result[0].phoneno;
      let pprice = result[0].pprice;
      let city = result[0].city;
      let pincode = result[0].pincode;
      var landmark = result[0].landmark;
      var date = result[0].date;
      let sql = "INSERT INTO addorder SET name = '" + name + "',phoneno= '" + phoneno + "', pprice = '" + pprice + "', city = '" + city + "',pincode= '" + pincode + "', landmark= '" + landmark + "', date= '" + date + "' "
      mysql.query(sql, (err, result) => {
        if (err)
          throw err
        else {
          res.redirect('/orderlog')
        }
      })
    }
  })
})


router.get('/home/', function (req, res, next) {
  res.render('home', { title: 'vendor home  Page' });
});

router.get('/banner/', function (req, res, next) {
  let sql = "SELECT * FROM   banner"
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render('banner', { title: 'Banner Page', sampleData: result });
    }
  })

});
router.get('/banner/delete/:id', (req, res) => {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM banner WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err)
      throw err
    else {
      res.redirect("/banner");
    }
  })
})
router.get('/banner/edit/:id', (req, res) => {
  var id = req.params.id;
  let qry = `SELECT * FROM banner WHERE id = '${id}'`
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render("updatebanner", { title: "update banner page ", sampleData: result })
    }
  })

});

router.post('/banner/edit/:id', upload.single("image"), (req, res) => {
  var id = req.params.id;
  var heading = req.body.heading;
  var url = req.body.url;
  var image = '/images/' + req.body.image;
  let qry = "UPDATE banner SET heading = '" + heading + "', url = '" + url + "' WHERE id = '" + id + "' "
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/banner")
    }
  })
})
router.post('/banner/', upload.single("image"), function (req, res, next) {
  var heading = req.body.heading;
  var url = req.body.url;
  var image = '/images/' + req.body.image;
  let qry = "INSERT INTO banner SET heading = '" + heading + "', url = '" + url + "', image = '" + image + "' ";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/banner")
    }
  })

})


/* 
    *******************************
          GAGAN Code
          Feature Section START
    *******************************
*/
router.get('/feature/', function (req, res, next) {
  let sql = "SELECT * FROM  feature_type"
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      res.render('feature', { title: 'Feature', sampleData: result });
    }
  })

});
router.get('/feature/delete/:id', (req, res) => {
  var id = req.params.id;
  // console.log(id);
  var sql = `DELETE FROM feature_type WHERE id = '${id}' `;
  mysql.query(sql, function (err, data) {
    if (err)
      throw err
    else {
      res.redirect("/feature");
    }
  })
})
router.get('/feature/edit/:id', (req, res) => {
  var id = req.params.id;
  let qry = `SELECT * FROM feature_type WHERE id = '${id}'`
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render("updatefeature", { title: "Update Feature", sampleData: result })
    }
  })

});
router.get('/checkfeatureslug', (req, res) => {
  var id = req.body.slug;
  let qry = `SELECT * FROM feature_type WHERE slug = '${id}'`
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result != "") {
        res.json(false);
      } else {
        res.json(true);
      }
    }
  })

});

router.post('/feature/edit/:id', (req, res) => {
  var id = req.params.id;
  var name = req.body.name;
  var slug = req.body.slug;
  let qry = "UPDATE feature_type SET name = '" + name + "', slug = '" + slug + "' WHERE id = '" + id + "' "
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/feature")
    }
  })
})
router.post('/feature/', function (req, res, next) {
  var name = req.body.name;
  var slug = req.body.slug;
  var image = '/images/' + req.body.image;
  let qry = "INSERT INTO feature_type (name, slug) VALUES ('" + name + "' , '" + slug + "')";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/feature")
    }
  })
})
/* 
    *******************************
          GAGAN Code
          Feature Section END
    *******************************
*/

/* Testing Purpose */
router.get('/combos_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM subcategory `;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "cakegiftlist": result, "status": true })
      }
    }
  })
})
// router.get('/Plant_Gifts_lists/',(req,res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   let qry = `SELECT * FROM subcategory `;
//   mysql.query(qry,(err,result) => {
//     if(err)
//     throw err
//     else{
//       if (result == '' || typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "plant_ gifts": result, "status": true })
//       }
//     }
//   })
// })
// router.get('/Flower_Gift_list/', (req,res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   let qry = `SELECT * FROM subcategory `;
//   mysql.query(qry, (err, result) => {
//     if(err)
//     throw err
//     else{
//       if (result == '' || typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "flowergiftslist": result, "status": true })
//       }
//     }
//   })
// })

router.get('/category_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM category `;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "category": result, "status": true })
      }
    }
  })
})




router.get('/product_details/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  let slug = req.query.subcategory_id;

  let sql = `SELECT addnewproduct.name as product_name, addnewproduct.image as product_image, addnewproduct.image1 as product_short_image1,addnewproduct.image2 as product_short_image2,addnewproduct.image3 as product_short_image3, addnewproduct.regularprice as product_price, addnewproduct.salesprice as product_discount_price, addattribute.image as attribute_image, addattribute.price as attribute_price, addattribute.title as attr_title, addattribute.terms as attr_terms, addnewproduct.quantity as product_quantity, addnewproduct.psku as sku FROM addnewproduct LEFT JOIN category ON addnewproduct.category = category.id LEFT JOIN subcategory ON addnewproduct.subcategoryId = subcategory.id LEFT JOIN filtertype ON addnewproduct.filtertype = filtertype.id LEFT JOIN addattribute ON addnewproduct.attributes = addattribute.id WHERE addnewproduct.slug = "${slug}"`;
  console.log(sql);
  mysql.query(sql, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        let productArray = {
          "product_name": result[0].product_name,
          "product_image": result[0].product_image,
          "product_short_image1": result[0].product_short_image1,
          "product_short_image2": result[0].product_short_image2,
          "product_short_image3": result[0].product_short_image3,
          "product_price": result[0].product_price,
          "product_discount_price": result[0].product_discount_price,
          "attribute": {
            "title": result[0].attr_title,
            "title_value": result[0].attr_terms,
            "price": result[0].attribute_price,
            "image": result[0].attribute_image
          },
          "product_specification": {
            "SKU": result[0].sku,
            "total_item": result[0].product_quantity
          }
        };
        res.json({ "product": productArray, "status": true })
      }
    }
  })
})


router.get('/product_data/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
  console.log(req.query.product_slug, "kkkkkkk")
  let slug = req.query.product_slug;
  let qry = `SELECT * FROM addnewproduct WHERE slug = '${slug}'`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      console.log(result, "jjjjjjjjkkkkkk")
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "product": result, "status": true })
      }
    }
  })

})


router.get('/category_slugs/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*")
})







router.get('/product_lists/', (req, res) => {
  // var productslug =  req.params.productslug

  res.header("Access-Control-Allow-Origin", "*");
  // console.log(req.query.categoryId,"fghjkll")
  let slug = req.query.categoryId;
  let qry = `SELECT * FROM category WHERE slug = '${slug}'`;
  mysql.query(qry, (err, result) => {
    if (err)

      throw err
    else {
      // res.json(qry)
      if (result != "") {
        var catid = result[0].id
        let ql = `SELECT category.name as product_category,subcategory.name as product_subcategory, filtertype.name as product_filtertype ,addnewproduct.name as product_name, addnewproduct.image as product_image, addnewproduct.regularprice as product_price, addnewproduct.salesprice as product_discount_price, CONCAT(TRUNCATE((addnewproduct.salesprice / addnewproduct.regularprice) * 100, 2),'%') as discount_percentage FROM addnewproduct LEFT JOIN category ON addnewproduct.category = category.id LEFT JOIN subcategory ON addnewproduct.subcategoryId = subcategory.id LEFT JOIN filtertype ON addnewproduct.filtertype = filtertype.id  WHERE subcategoryId IN (SELECT id FROM subcategory WHERE categoryId = ${catid} )`
        // console.log(ql,"ghjkhArdeep")
        mysql.query(ql, (err, productResult) => {
          if (err)
            throw err
          else {
            // console.log(productResult, "subcategoryyyyyyyyyyyyyyyyyy")
            if (productResult == '' || typeof productResult == undefined || !productResult) {
              res.json({ "result": "No data found", "status": false })
            } else {
              res.json({ "product": productResult, "status": true })
            }

          }
        })
      } else {
        res.json([false, "No data", qry])
      }
    }

  })
})

router.get('/addpartner/', (req, res) => {
  res.render("addpartner", { title: "addpartner page " })
})
router.post("/addpartner", (req, res) => {
  var name = req.body.name;
  var email = req.body.email;
  var details = req.body.details;
  let qry = " INSERT INTO partner SET name = '" + name + "', email = '" + email + "', details =  '" + details + "'    ";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.redirect("/partner")
    }
  })

})

router.get('/partner/', (req, res) => {
  let qry = "SELECT *  FROM partner"
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      res.render("partner", { title: "partner page ", sampleData: result })
    }
  })

})
router.get('/feedback/', (req, res) => {
  res.render("feedback", { title: "feedback page" })
})
router.get('/subcategory_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = "SELECT category.name as categorytype, subcategory.* FROM category JOIN subcategory ON category.id = subcategory.categoryId; ";
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "subcategory": result, "status": true })
      }
    }
  })
})
router.get('/combos_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM subcategory `;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "cakegiftlist": result, "status": true })
      }
    }
  })
})
router.get('/cake_Gifts_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM subcategory `;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "cakegiftlist": result, "status": true })
      }
    }
  })
})
// router.get('/product_lists/', (req, res) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   let qry = "SELECT * FROM addnewproduct" ;
//   mysql.query(qry, (err, result) => {
//     if (err)
//       throw err
//     else {
//       if (result == ''|| typeof result == undefined || !result) {
//         res.json({ "result": "No data found", "status": false })
//       } else {
//         res.json({ "bestSellingLists": result, "status": true })
//       }
//     }
//   })
// });
router.get('/bestselling_lists/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM addnewproduct `;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "bestSellingLists": result, "status": true })
      }
    }
  })
});

router.get('/personalized_list/', (req, res) => {
  res.header("Access-Control-Allow-Origin", "*");
  let qry = `SELECT * FROM subcategory  LIMIT 6`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "personalizedLists": result, "status": true })
      }
    }
  })
})

router.get('/fetch-subcategories/', (req, res) => {
  let qry = `SELECT * FROM subcategory WHERE categoryId = '${req.query.categoryId}'`;
  // console.log(qry)
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
router.get('/fetch-products/', (req, res) => {
  let qry = `SELECT * FROM addnewproduct WHERE subcategory = '${req.query.nameId}'`;
  // console.log("rajat", qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(result)
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json(result)
      }
    }
  })
});
// router.get('/fetch-imagedetails/',(req,res)=>{
//   let qry = `SELECT * FROM addnewproduct WHERE image = '${req.query.nameId}'`;
//   console.log("soni", qry)
//   mysql.query(qry, (err,result)=>{
//     if(err)
//     throw err
//     else{
//     if(result == '' || result ==undefined || !result){
//       res.json({ "result": "No data found", "status": false })
//     }  else {
//       res.json({ "result": result, "status": true })   
//     }
//     }
//   })
// })
router.get('/fetch-productsdetails/', (req, res) => {
  let qry = `SELECT * FROM addnewproduct WHERE name = '${req.query.nameId}'`;
  // console.log("rajat", qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      // console.log(result)
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json(result)
      }
    }
  })
});
// router.get('/fetch-products/', (req, res) => {
//   let qry = `SELECT * FROM addnewproduct WHERE  category = '${req.query.imageId}'`;
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
router.get("/fetch-coupon/", (req, res) => {
  let qry = `SELECT * FROM coupon WHERE code = '${req.query.titleId}'`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err;
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        // console.log(result)
        res.json({ "result": result, "status": true })
      }
    }
  })
})

router.get('/fetch-citydata/', (req, res) => {
  console.log(req.query.regionId, "55555")
  let id = req.query.regionId
  let qry = `SELECT * FROM city WHERE regionId = '${id}'`;

  // console.log(qry,kkkkkk)
  console.log(qry, "kkkkkk")
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      console.log(result, "rrrrr")
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true });
      }
    }
  })
})
router.get("/fetch-attributes/", (req, res) => {
  let qry = `SELECT * FROM addattribute WHERE title = '${req.query.titleId}'`;
  // console.log(qry)
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
router.get('/fetch-imagedetails/', upload.single("image"), (req, res) => {
  let qry = `SELECT * FROM addnewproduct WHERE name = '${req.query.nameId}'`;
  // console.log("soni", qry)
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        res.json({ "result": result, "status": true })
      }
    }
  })
})

router.get("/fetch-producttypes/", (req, res) => {
  let qry = `SELECT * FROM filtertype WHERE filtesubcategoryId = '${req.query.filtersubcategoryId}'`;
  // console.log(qry,"rrrrrrryyyyyyy")
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        // console.log(result,"llooooppppppp")
        res.json({ "result": result, "status": true })
        // res.json(result);
      }
    }
  })
})


/* 

  React Js Api Lists

*/


router.get("/product_list/best_selling/", (req, res) => {
  let qry = `SELECT category.name as product_category, subcategory.name as product_subcategory, feature_type.name as product_filtertype ,addnewproduct.name as product_name, addnewproduct.image as product_image, addnewproduct.regularprice as product_price, addnewproduct.salesprice as product_discount_price, CONCAT(TRUNCATE((addnewproduct.salesprice / addnewproduct.regularprice) * 100, 2),'%') as discount_percentage FROM feature_product INNER JOIN feature_type ON feature_type.id = feature_product.feature_id INNER JOIN addnewproduct ON addnewproduct.id = feature_product.product_id INNER JOIN category ON category.id = addnewproduct.category INNER JOIN subcategory ON subcategory.id = addnewproduct.subcategoryId WHERE feature_type.slug = 'best_selling'`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        // console.log(result,"llooooppppppp")
        res.json({ "result": result, "status": true })
        // res.json(result);
      }
    }
  })

})

router.get("/product_list/trending/", (req, res) => {
  let qry = `SELECT category.name as product_category, subcategory.name as product_subcategory, feature_type.name as product_filtertype ,addnewproduct.name as product_name, addnewproduct.image as product_image, addnewproduct.regularprice as product_price, addnewproduct.salesprice as product_discount_price, CONCAT(TRUNCATE((addnewproduct.salesprice / addnewproduct.regularprice) * 100, 2),'%') as discount_percentage FROM feature_product INNER JOIN feature_type ON feature_type.id = feature_product.feature_id INNER JOIN addnewproduct ON addnewproduct.id = feature_product.product_id INNER JOIN category ON category.id = addnewproduct.category INNER JOIN subcategory ON subcategory.id = addnewproduct.subcategoryId WHERE feature_type.slug = 'trending'`;
  mysql.query(qry, (err, result) => {
    if (err)
      throw err
    else {
      if (result == '' || typeof result == undefined || !result) {
        res.json({ "result": "No data found", "status": false })
      } else {
        // console.log(result,"llooooppppppp")
        res.json({ "result": result, "status": true })
        // res.json(result);
      }
    }
  })

})


module.exports = router;
