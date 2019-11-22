var express = require('express');
var router = express.Router();
const {search} = require('../crawler/load');
const {test, apply_refinements, parse_results} = require('../crawler/process');

/* GET home page. */
router.post('/', async function(req, res, next) {
  console.log(req.body);
  let key_word = req.body['key_word'];
  let refinements = req.body['refinements'];
  let html = await search(key_word);
  html = await apply_refinements(html, refinements);
  let list_obj = await parse_results(html);
  res.send(list_obj);
});

module.exports = router;
