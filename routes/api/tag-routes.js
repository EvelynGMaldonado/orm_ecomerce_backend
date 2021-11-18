const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', (req, res) => {
  // find all tags
  Tag.findAll({
  // be sure to include its associated Product data 
  include: [{
    model: Product,
    through:ProductTag
  }]  
  }).then (dbTags => {
    // if(dbTags.length) {
      res.json(dbTags);
    // } else {
    //   res.status(404).json({message: "No categories found"});
    // }
  }). catch(err=>{
    console.log(err);
    res.status(500).json({message: "an error occurred", err:err});
  })
});

router.get('/:id', (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
  // be sure to include its associated Product data 
  
  where: {
    id:req.params.id
    // product_id:req.body.product_id,
    // tag_id:req.body.tag_id
  },
  include: [{
    model:Product,
    through:ProductTag

  }], 
}).then(foundTagById => {
  if(!foundTagById) {
    res.status(401).json({message:"incorrect id"});
  } else {
    res.json(foundTagById);
  }
})
});

router.post('/', (req, res) => {
  // create a new tag
  Tag.create(
    req.body
  ).then(newTag => {
    res.json(newTag);
  }).catch(err => {
    console.log(err);
    res.status(500),json({message:"an error occurred"})
  })
});

router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
  Tag.update({
    // id:req.body.id,
    tag_name:req.body.tag_name
  },
  {
    //get the category based in the id given
    where: {
      id:req.params.id
    },
  }
  ).then((updatedProductTags) => {
    res.json(updatedProductTags);
  }).catch((err) => {
    console.log(err);
    res.json(err);
  })
});

router.delete('/:id', (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where:{
      id:req.params.id
    }
  }).then(deleteTag => {
    res.json(deleteTag)
  })
});


module.exports = router;
