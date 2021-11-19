const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', (req, res) => {
  console.log("request")
  Product.findAll({
    // be sure to include its associated Category and Tag data
  include: [
    Category,
    {
      model: Tag,
      through: ProductTag
    }
  ]
}).then (dbProduct => {
  // if(dbProduct.length) {
    res.json(dbProduct);
  // } else {
  //   res.status(404).json({message: "No products found"});
  // }
}). catch(err=>{
  console.log(err);
  res.status(500).json({message: "an error occurred", err:err});
})
});

// get one product
router.get('/:id', (req, res) => {
  // find a single product by its `id`
  Product.findOne({
  // be sure to include its associated Category and Tag data 
  where: {
    id:req.params.id
  },
  include: [
    Category,
    {
      model: Tag,
      through: ProductTag
    }
  ]
}).then(foundProductById => {
  if(!foundProductById) {
    res.status(401).json({message:"incorrect id"});
  } else {
    res.json(foundProductById);
  }
})
});

// create new product
router.post('/', (req, res) => {
  /* req.body should look like this...
  */
  // Product.create({
  //   product_name: "Basketball",
  //   price: 200.00,
  //   stock: 3,
  //   category_id: [1, 2, 3, 4],
  //   tagIds: [1, 2, 3, 4] 
  // }
//   try {
//     const productData = await Product.create({
//     product_name: req.body.product_name,
//     price:req.body.price,
//     stock: req.body.stock,
//     tag_id: req.body.tag_id,
//   });
//   res.status(200).json(productData);
// } catch (err) {
//   res.status(400).json(err);
// }
Product.create(req.body)
    .then((product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', (req, res) => {
  console.log(req.body);
  // update product data
  Product.update(
    req.body,
  {
    where: {
      id: req.params.id,
    },
  }).then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', (req, res) => {
  // delete one product by its `id` value
  Product.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((deletedProduct) => {
      res.json(deletedProduct);
    })
    .catch((err) => res.json(err));
});

module.exports = router;
