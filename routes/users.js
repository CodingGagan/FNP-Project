var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('users', { title: 'Users Page' });
});


router.get('/add-new-user/', function(req, res, next) {
  res.render('users/newuser', { title: 'Add New User Page' });
});

module.exports = router;
