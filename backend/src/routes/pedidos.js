const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middlewares/auth');
const { sequelize, Order, OrderItem, Dish, Profile } = require('../models');
const { Sequelize } = require('sequelize');

function generateOrderNumber() {
  // simple 4-digit unique-ish number - for production replace with better unique generator
  return Math.floor(Math.random() * 10000).toString().padStart(4, '0');
}

// GET /pedidos - admin: list all
router.get('/', authenticate, requireAdmin, async (req, res) => {
  const orders = await Order.findAll({ include: [{ model: OrderItem, as: 'items' }, { model: Profile }] });
  return res.json(orders);
});

// GET /pedidos/usuario - authenticated user orders
router.get('/usuario', authenticate, async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.findAll({ where: { user_id: userId }, include: [{ model: OrderItem, as: 'items', include: [{ model: Dish }] }] });
  return res.json(orders);
});

// GET /pedidos/:id - admin
router.get('/:id', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }] });
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  return res.json(order);
});

// POST /pedidos - authenticated creates new order
// Accepts: platos: [{id, cantidad}], optionally tipo_entrega, numero_mesa, direccion_entrega, cupon_codigo
router.post('/', authenticate, async (req, res) => {
  const userId = req.user.id;
  const { platos, tipo_entrega, numero_mesa, direccion_entrega, cupon_codigo } = req.body;
  if (!Array.isArray(platos) || platos.length === 0) return res.status(400).json({ message: 'Platos faltantes' });

  // validate and compute total
  let total = 0;
  const items = [];

  for (const p of platos) {
    if (!p.id || !p.cantidad) return res.status(400).json({ message: 'Cada plato debe tener id y cantidad' });
    const dish = await Dish.findByPk(p.id);
    if (!dish) return res.status(404).json({ message: `Plato con id ${p.id} no existe` });
    const price = dish.precio;
    total += price * p.cantidad;
    items.push({ dish_id: dish.id, cantidad: p.cantidad, precio_unitario: price });
  }

  // create order (apply coupon if present)
  try {
    const numero_orden = generateOrderNumber();
    let cupon_id = null;
    if (cupon_codigo) {
      const coupon = await sequelize.models.Coupon.findOne({ where: { codigo: cupon_codigo, activo: true } });
      if (coupon) {
        cupon_id = coupon.id;
        total = Math.round(total * (100 - (coupon.descuento_porcentaje || 0)) / 100);
      }
    }

    const order = await Order.create({ user_id: userId, total, numero_orden, tipo_entrega: tipo_entrega || 'takeaway', numero_mesa: numero_mesa || null, direccion_entrega: direccion_entrega || null, cupon_id, qr_code: req.body.qr_code || null });

    // create items
    for (const it of items) {
      await OrderItem.create({ order_id: order.id, dish_id: it.dish_id, cantidad: it.cantidad, precio_unitario: it.precio_unitario });
    }

    // include items and associated dishes for the response
    const result = await Order.findByPk(order.id, { include: [{ model: OrderItem, as: 'items', include: [{ model: Dish }] }, { model: Profile }] });

    return res.status(201).json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al crear pedido' });
  }
});

// PUT status routes - admin only
// General update (admin)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  try {
    await order.update(req.body);
    return res.json(order);
  } catch (err) {
    console.error(err);
    return res.status(400).json({ message: 'Error updating order' });
  }
});

router.put('/:id/aceptar', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  order.estado = 'aceptado';
  await order.save();
  return res.json({ message: 'Pedido aceptado' });
});

router.put('/:id/comenzar', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  order.estado = 'en_camino';
  await order.save();
  return res.json({ message: 'Pedido en camino' });
});

router.put('/:id/entregar', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  order.estado = 'entregado';
  await order.save();
  return res.json({ message: 'Pedido entregado' });
});

// DELETE /pedidos/:id - admin
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  const order = await Order.findByPk(req.params.id);
  if (!order) return res.status(404).json({ message: 'Pedido no encontrado' });
  await order.destroy();
  return res.json({ message: 'Pedido eliminado' });
});

module.exports = router;
