const express = require('express');
const auth = require('../middleware/auth')
const router = express.Router();
const sauceCtrl = require('../controllers/sauces');
const multer = require("../middleware/multer-config");

router.get('/sauces', auth, sauceCtrl.getAllSauces);
router.get('/sauces/:id', auth, sauceCtrl.getOneSauce);
router.post('/sauces', auth, multer, sauceCtrl.createSauce);
router.put('/sauces/:id', auth, multer, sauceCtrl.modOneSauce);
router.delete('/sauces/:id', auth, sauceCtrl.deleteOneSauce);
router.post('/sauces/:id/like', auth, sauceCtrl.likeOneSauce);

module.exports = router;