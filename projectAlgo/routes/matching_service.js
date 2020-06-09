var express = require('express');
var router = express.Router();

  router.get('/', (req, res) => {
    console.log('matching_service join');
    res.render('matching_service');
  });




module.exports = router;
