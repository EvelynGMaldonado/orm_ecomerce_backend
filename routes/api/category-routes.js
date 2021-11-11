const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', (req, res) => {
  // find all categories
  Category.findAll({
      // be sure to include its associated Products
    include: [Product]
  }).then (dbCategories => {
    if(dbCategories.length) {
      res.json(dbCategories);
    } else {
      res.status(404).json({message: "No categories found"});
    }
  }). catch(err=>{
    console.log(err);
    res.status(500).json({message: "an error occurred", err:err});
  })
});

router.get('/:id', (req, res) => {
  // find one category by its `id` value
  Category.findOne({
      // be sure to include its associated Products
    include:[Product],
    where: {
      id:req.body.id
    }
  }).then(foundCategoryById => {
    if(!foundCategoryById) {
      res.status(401).json({message:"incorrect id"});
    } else {
      res.json(foundCategoryById);
    }
  })
});

router.post('/', (req, res) => {
  // create a new category
  Category.create({
    id:req.body.id,
    category_name:req.body.category_name
  }).then(newCategory => {
    res.json(newCategory);
  }).catch(err => {
    console.log(err);
    res.status(500),json({message:"an error occurred"})
  })
});

router.put('/:id', (req, res) => {
  // update a category by its `id` value
  Category.update({
    id:req.body.id,
    category_name:req.body.category_name
  },
  {
    //get the category based in the id given
    where: {
      id:req.params.id
    },
  }
  ).then((updateCategory) => {
    res.json(updateCategory);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where:{
      id:req.params.id
    }
  }).then(deleteCategory => {
    res.json(deleteCategory)
  })
});

module.exports = router;
