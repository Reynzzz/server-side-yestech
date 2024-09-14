const express = require("express");
const router = express.Router();
const ControllerPublic = require('../controllers/controllerPublic/controllerPublic')


router.get('/getBanner',ControllerPublic.getBanner)
router.get('/getCategoryProducts',ControllerPublic.getCategopryProducts)
router.get('/getProduct',ControllerPublic.getProduct)
router.get('/getCase',ControllerPublic.getCaseList)
router.get('/getCategoryOwner',ControllerPublic.getCategopryYestech)
router.get('/getYestechOwner',ControllerPublic.getYestechOwner)
router.get('/getWarehouse',ControllerPublic.getWarehouse)

module.exports = router