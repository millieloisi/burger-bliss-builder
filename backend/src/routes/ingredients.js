const express = require('express');
const router = express.Router();
const { Ingredient } = require('../models');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// GET /ingredients - public
router.get('/', async (req, res) => {
  try {
    const list = await Ingredient.findAll();
    return res.json(list);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /ingredients/:id
router.get('/:id', async (req, res) => {
  const i = await Ingredient.findByPk(req.params.id);
  if (!i) return res.status(404).json({ message: 'Ingredient not found' });
  return res.json(i);
});

// POST /ingredients - admin
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const it = await Ingredient.create(req.body);
    return res.status(201).json(it);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT /ingredients/:id - admin
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const it = await Ingredient.findByPk(req.params.id);
  if (!it) return res.status(404).json({ message: 'Ingredient not found' });
  try {
    await it.update(req.body);
    return res.json(it);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE /ingredients/:id - admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const it = await Ingredient.findByPk(req.params.id);
  if (!it) return res.status(404).json({ message: 'Ingredient not found' });
  await it.destroy();
  return res.json({ message: 'Ingredient deleted' });
});

module.exports = router;
