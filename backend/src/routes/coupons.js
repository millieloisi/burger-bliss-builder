const express = require('express');
const router = express.Router();
const { Coupon } = require('../models');
const { authenticate, requireAdmin } = require('../middlewares/auth');

// GET /coupons - list active
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.findAll({ where: { activo: true } });
    return res.json(coupons);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// GET /coupons/:codigo
router.get('/:codigo', async (req, res) => {
  try {
    const c = await Coupon.findOne({ where: { codigo: req.params.codigo, activo: true } });
    if (!c) return res.status(404).json({ message: 'Coupon not found' });
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// POST /coupons - admin
router.post('/', authenticate, requireAdmin, async (req, res) => {
  const { codigo, descuento_porcentaje, activo } = req.body;
  if (!codigo) return res.status(400).json({ message: 'Missing codigo' });
  try {
    const c = await Coupon.create({ codigo, descuento_porcentaje, activo });
    return res.status(201).json(c);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid data' });
  }
});

// PUT /coupons/:id - admin
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const c = await Coupon.findByPk(req.params.id);
  if (!c) return res.status(404).json({ message: 'Coupon not found' });
  try {
    await c.update(req.body);
    return res.json(c);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Invalid data' });
  }
});

// DELETE /coupons/:id - admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const c = await Coupon.findByPk(req.params.id);
  if (!c) return res.status(404).json({ message: 'Coupon not found' });
  await c.destroy();
  return res.json({ message: 'Coupon deleted' });
});

module.exports = router;
