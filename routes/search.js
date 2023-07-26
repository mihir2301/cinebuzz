const express = require('express');
const router = express.Router();

const searchmovie = require('../controllers/searchMovie');

router.post('/search',searchmovie.search);

module.exports = router;