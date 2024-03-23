const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// Find all tags, including associated Product data
router.get('/', async (req, res) => {
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product}, {model: ProductTag, attributes: ['product_id'], through: ProductTag, as: 'productTags'}]
    });
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


// Find a single tag by its `id`, including its associated Product data
router.get('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'productTags' }], 
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create a new tag
router.post('/', async (req, res) => {
  if (!req.body.tag_name) {
    return res.status(400).json({ message: 'Tag name is required' });
  }

  try {
    const newTag = await Tag.create({
      tag_name: req.body.tag_name,
    });
    res.status(200).json(newTag);
  } catch (err) {
    console.error(err);
    res.status(500).json(err); 
  }
});


router.put('/:id', (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then((tag) => {
    res.status(200).json(tag);
  }) .catch((err) => {
    console.log(err);
    res.status(400).json(err);
  });
});




// Delete one tag by its `id` value
router.delete('/:id', async (req, res) => {
  try {
    const deleteResult = await Tag.destroy({
      where: { id: req.params.id },
    });
    
    if (deleteResult === 0) {
      res.status(404).json({ message: 'No tag found with this id' });
      return;
    }
    
    res.status(200).json({ message: 'Tag deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
