var express = require('express');
var router = express.Router();
var wikiPhilosophy = require('../utils/wiki-philosophy.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('hey');
});

router.get('/wiki-philosophy', function(req,res,next){
	if(req.query && req.query.title){
		wikiPhilosophy(req.query.title)
		.then( success => {
			res.status(200);
			res.send(success);
		}, err => {
			res.status(400);
			res.send('Error trying to find path');
		});
	} else {
		res.status(400);
		res.send('Missing title');
	}
});

module.exports = router;
