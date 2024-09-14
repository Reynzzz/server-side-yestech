const express = require("express");
const router = express.Router();
const ControllerAdmin = require('../controllers/controllerAdmin/controllerAdmin')
const ControllerNews = require('../controllers/controllerAdmin/controllerNews')
const ControllerUserAdmin = require('../controllers/controllerAdmin/controllerUserAdmin')
const uploadNews = require('../helpers/multer/multerNews')
const upload = require('../helpers/multer/multer')
const uploadProducts = require('../helpers/multer/multerProducts')
const uploadCaseList = require('../helpers/multer/multerCaseList')
const uploadYestechOwner = require('../helpers/multer/multerYestechOwner')
const uploadWarehouse = require('../helpers/multer/multerWarehouse')
router.get('/banner',ControllerAdmin.getBanner)
router.get('/banner/:id',ControllerAdmin.getBannerById)
router.post('/banner',upload.single('imageBanner'),ControllerAdmin.postBanner)
router.put('/banner/:id',upload.single('imageBanner'),ControllerAdmin.updateBanner)
router.delete('/banner/:id',ControllerAdmin.deleteBanner)

// cateogry Products
router.get('/categoryProducts',ControllerAdmin.getCategopryProducts)
router.post('/categoryProducts',ControllerAdmin.postCategoryProducts)
router.put('/categoryProducts/:id',ControllerAdmin.updateCategoryProducts)
router.delete('/categoryProducts/:id',ControllerAdmin.deleteCategoryProducts)
//
router.get('/type',ControllerAdmin.getTypes)
router.post('/type',ControllerAdmin.postTypes)
router.put('/type/:id',ControllerAdmin.updateType)
router.delete('/type/:id',ControllerAdmin.deleteType)
//products
router.get('/products',ControllerAdmin.getProduct)
router.get('/productsAdmin/:id',ControllerAdmin.getProductDetailsAdmin)
router.get('/products/detail',ControllerAdmin.getProductDetails)
router.post('/products', uploadProducts.array('mainImg'), ControllerAdmin.postProducts);
router.put('/products/:id', uploadProducts.array('mainImg'), ControllerAdmin.updateProducts);
router.delete('/products/:id',ControllerAdmin.deleteProducts)

// Case List 
router.get('/caseList',ControllerAdmin.getCaseList)
router.get('/caseList/:id',ControllerAdmin.getCaseById)
router.post('/caseList',uploadCaseList.any('image'),ControllerAdmin.postCaseList)
router.put('/caseList/:id',uploadCaseList.any('image'),ControllerAdmin.updateCaseList)
router.delete('/caseList/:id',ControllerAdmin.deleteCaseList)

// yestech owner 
router.get('/categoryYestech',ControllerAdmin.getCategopryYestech)
router.post('/categoryYestech',ControllerAdmin.postCategoryYestech)
router.put('/categoryYestech/:id',ControllerAdmin.editCategoryYestech)
router.delete('/categoryYestech/:id',ControllerAdmin.deleteCategoryYestech)
router.put('/yestechOwner/:id',uploadYestechOwner.single('image'),ControllerAdmin.editYestechOwner)
router.get('/yestechOwner',ControllerAdmin.getYestechOwner)
router.post('/yestechOwner',uploadYestechOwner.single('image'),ControllerAdmin.postYestechOwner)
router.delete('/yestechOwner/:id',ControllerAdmin.deleteYestechOwner)

// histori yestech
router.get('/histori',ControllerAdmin.getHistroriYestech)
router.post('/histori',ControllerAdmin.postHistoriYestech)
router.delete('/histori/:id',ControllerAdmin.deleteHistoriYestech)
router.put('/histori/:id',ControllerAdmin.editHistory)



// news
router.get('/news',ControllerNews.getAllNews)
router.delete('/news-image/:filename',ControllerNews.deleteImageNews)
router.get('/newsAdmin',ControllerNews.getAllNewsAdmin)
router.get('/news',ControllerNews.getNewsById)
router.get('/news-detail/:id',ControllerNews.getNewsByIdAdmin)
router.put('/news/:id',uploadNews.any('imageNews'),ControllerNews.updateNews)
router.delete('/news/:id',ControllerNews.deleteNews)
router.post('/news',uploadNews.any('imageNews'),ControllerNews.postNews)
router.get('/detail-news',ControllerNews.getNewsById)

// warehouse 
router.get('/warehouse',ControllerAdmin.getWarehouse)
router.post('/warehouse',uploadWarehouse.any('image'),ControllerAdmin.postWarehouse)
router.delete('/warehouse/:id',ControllerAdmin.deleteWarehouse)


router.post('/adminRegister',ControllerUserAdmin.registerAdmin)
router.post('/adminLogin',ControllerUserAdmin.Login)
module.exports = router