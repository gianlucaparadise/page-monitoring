var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/pippo', function(req, res, next) {
  var pippo = {
    name: "pippo",
    surname: "pluto"
  };
  
  res.json(pippo);
});

module.exports = router;
