var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('vendordata', { title: 'Users Page' });
});



module.exports = router;
