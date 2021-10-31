const router = require('express').Router();

const categoryRoutes = require('./category-routes');
router.use('/categories', categoryRoutes);

const productRoutes = require('./product-routes');
router.use('/products', productRoutes);

const tagRoutes = require('./tag-routes');
router.use('/tags', tagRoutes);

module.exports = router;
