const express = require('express')
const { addProducts, getAllProducts } = require('../controllers/productControllers')
const { addFavs, getAllfavProducts, removeFromFav } = require('../controllers/favControllers')
const { addcarts, getAllcartProducts, removeFromcart } = require('../controllers/cartControllers')
const router = express.Router()
const authMiddleware = require('../middlewares/authMiddleware')

router.post('/addproduct' , addProducts )
router.get('/getproducts' , getAllProducts )
router.put('/updateproduct/:id', async (req, res) => {
    try {
        const updatedProduct = await require('../modal/productSchema').findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.delete('/deleteproduct/:id', async (req, res) => {
    try {
        await require('../modal/productSchema').findByIdAndDelete(req.params.id);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
router.post('/addfav', authMiddleware, addFavs);
router.get('/addfav', authMiddleware, getAllfavProducts);
router.delete('/addfav/:id', authMiddleware, removeFromFav);
router.post('/addcart',authMiddleware , addcarts )
router.get('/addcart' ,authMiddleware , getAllcartProducts )
router.delete('/addcart/:id', removeFromcart )


module.exports = router
