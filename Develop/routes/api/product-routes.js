const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// Get all products
router.get('/', async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, attributes: ['tag_name'], through: ProductTag, as: 'productTags'}]
    });
    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Get one product by id
router.get('/:id', async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category}, { model: Tag, attributes: ['tag_name'], through: ProductTag, as: 'productTags'}]
    });

    if (!productData) {
      res.status(404).json({ message: 'No product found with this id' });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Create a new product
router.post('/', async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'please include product name, category, price and stock' });
  }
});

// Update a product
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const [updatedCount] = await Product.update(req.body, { where: { id: productId } });

    if (updatedCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    const updatedProduct = await Product.findByPk(productId);
    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const deletedCount = await Product.destroy({ where: { id: productId } });

    if (deletedCount === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
