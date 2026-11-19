const fav = require('../modal/fav');

const addFavs = async (req, res) => {
    try {
        const { title, image, company, price } = req.body;
        const userId = req.user.id || req.user._id;

        const existingProduct = await fav.findOne({
            title,
            user: userId
        });

        if (existingProduct) {
            return res.status(200).json({
                message: 'Product already in favourites',
                fav: existingProduct
            });
        }

        const favProduct = await fav.create({
            title,
            image,
            company,
            price,
            user: userId
        });

        return res.status(201).json({
            message: 'Product added to favourites',
            fav: favProduct
        });

    } catch (error) {
        console.error('Add favourite error:', error);
        return res.status(500).json({
            message: 'Unable to add favourite'
        });
    }
};

const getAllfavProducts = async (req, res) => {
    try {
        const userId = req.user.id || req.user._id;

        const products = await fav.find({
            user: userId
        });

        return res.status(200).json(products);

    } catch (error) {
        console.error('Get favourites error:', error);
        return res.status(500).json({
            message: 'Unable to fetch favourites'
        });
    }
};

const removeFromFav = async (req, res) => {
    try {
        const deletedProduct = await fav.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id || req.user._id
        });

        if (!deletedProduct) {
            return res.status(404).json({
                message: 'Favourite not found'
            });
        }

        return res.json({
            message: 'Favourite removed successfully'
        });

    } catch (error) {
        console.error('Remove favourite error:', error);
        return res.status(500).json({
            message: 'Unable to remove favourite'
        });
    }
};

module.exports = {
    addFavs,
    getAllfavProducts,
    removeFromFav
};