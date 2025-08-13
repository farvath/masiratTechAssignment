const express = require('express');
const multer = require('multer');
const router = express.Router();
const productController = require('../controllers/productsController');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/categories', productController.getCategories);
router.post('/', productController.createProduct);
router.post('/import', upload.single('file'), productController.importProducts);
router.get('/export', productController.exportProducts);
router.get('/', productController.getProducts);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/history', productController.getProductHistory);

module.exports = router;
