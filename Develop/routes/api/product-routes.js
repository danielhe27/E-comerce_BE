const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, attributes: ['tag_name'], through: ProductTag, as: 'productTag_products'}]
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get one product by id
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category}, { model: Tag, attributes: ['tag_name'], through: ProductTag, as: 'productTag_products'}]
    });

    if (!productData) {
      res.status(400).json({ message: 'No product found with this id' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Create a new product
router.post('/', (req, res) => {
  Product.create(req.body)
    .then((product) => {

      if (req.body.tagIds && req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return { product_id: product.id, tag_id };
        });

        return ProductTag.bulkCreate(productTagIdArr).then((productTagIds) => {

          return res.status(200).json({ product, productTagIds });
        });
      }
      res.status(200).json(product);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// Update a product
router.put('/:id', async (req, res) => {
  try {
    await Product.update(req.body, {
      where: { id: req.params.id },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const currentTags = await ProductTag.findAll({ where: { product_id: req.params.id } });
      const currentTagIds = currentTags.map((tag) => tag.tag_id);
      const newTags = req.body.tagIds.filter((tag_id) => !currentTagIds.includes(tag_id))
                        .map((tag_id) => { return { product_id: req.params.id, tag_id }; });
      const tagsToRemove = currentTags.filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
                            .map((tag) => tag.id);

      await Promise.all([
        ProductTag.destroy({ where: { id: tagsToRemove } }),
        ProductTag.bulkCreate(newTags),
      ]);
    }

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag, as: 'tags' }],
    });
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deleteStatus = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!deleteStatus) {
      return res.status(404).json({ message: 'No product found with this id' });
    }

    res.status(200).json({ message: 'Product successfully deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
