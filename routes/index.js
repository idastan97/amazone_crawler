var express = require('express');
var router = express.Router();
const {search} = require('../crawler/load');
const {test, apply_refinements} = require('../crawler/process');

/* GET home page. */
router.post('/', async function(req, res, next) {
  console.log(req.body);
  let key_word = req.body['key_word'];
  let refinements = req.body['refinements'];
  let html = await search(key_word);
  let new_url = await apply_refinements(html, refinements);
  res.send(new_url);
});

module.exports = router;
