const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
// GET all categories and if successful return status 200 or error catch 500
router.get('/', async (_req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }]
    });
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});
// this router get  category by id
// so if successful return status 200 or error catch 500
router.get('/:id', async (req, res) => {
  try {
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }]
  });
  if (!categoryData) {
    res.status(404).json({ message: 'No category found with this id' });
    return;
  }
  res.status(200).json(categoryData);
} catch (err) {
  res.status(500).json(err);
}
});

// router post to create new category
router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json({error: 'please include a valid category name'});
  }
});

// router put to update category by id
router.put('/:id', async  (req, res) => {
await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    })
    .then((category) => {
      res.status(200).json(category);
    }) .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    })
  });

// router delete to delete category by id
router.delete('/:id', async (req, res) => {
    const categoryData = Category.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then(categoryData => res.status(200).json(categoryData))
      .catch((err) => {
        res.status(500).json(err)
      })
  });

module.exports = router;
