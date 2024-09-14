const express = require("express");
const router = express.Router();
const routerPublic = require('./public')
const routerdmin = require('./admin')

router.use('/',routerPublic)
router.use('/',routerdmin)




module.exports = router