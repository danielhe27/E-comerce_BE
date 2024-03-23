const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint
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


router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json({error: 'please include a valid category name'});
  }
  // create a new category
});


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
