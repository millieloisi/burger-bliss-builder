const express = require('express');
const router = express.Router();
const { Dish } = require('../models');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// GET /platos - list all
router.get('/', async (req, res) => {
  const dishes = await Dish.findAll();
  return res.json(dishes);
});

// GET /platos/:id
router.get('/:id', async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.status(404).json({ message: 'Plato no encontrado' });
  return res.json(dish);
});

// GET /platos/tipo/:tipo
router.get('/tipo/:tipo', async (req, res) => {
  const tipo = req.params.tipo;
  const dishes = await Dish.findAll({ where: { tipo } });
  return res.json(dishes);
});

// POST /platos - admin
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { tipo, nombre, precio, descripcion, imagen_url, disponible } = req.body;
  if (!tipo || !nombre || precio == null) return res.status(400).json({ message: 'Campos obligatorios faltantes' });
  try {
    const dish = await Dish.create({ tipo, nombre, precio, descripcion, imagen_url, disponible });
    return res.status(201).json(dish);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// PUT /platos/:id - admin
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.status(404).json({ message: 'Plato no encontrado' });
  try {
    await dish.update(req.body);
    return res.json(dish);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Datos inválidos' });
  }
});

// DELETE /platos/:id - admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const dish = await Dish.findByPk(req.params.id);
  if (!dish) return res.status(404).json({ message: 'Plato no encontrado' });
  await dish.destroy();
  return res.json({ message: 'Plato eliminado' });
});

module.exports = router;
