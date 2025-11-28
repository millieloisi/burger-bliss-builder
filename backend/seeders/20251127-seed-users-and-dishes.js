'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface) => {
    // seed users
    const adminPassword = await bcrypt.hash('adminpass', 10);
    const userPassword = await bcrypt.hash('userpass', 10);

    const adminId = require('uuid').v4();
    const userId = require('uuid').v4();
    const user2Id = require('uuid').v4();

    await queryInterface.bulkInsert('profiles', [
      { id: adminId, nombre: 'Admin', apellido: 'Root', email: 'admin@burger.dev', password: adminPassword, admin: true, created_at: new Date() },
      { id: userId, nombre: 'Juan', apellido: 'Pérez', email: 'juan@example.com', password: userPassword, admin: false, created_at: new Date() },
      { id: user2Id, nombre: 'María', apellido: 'Gonzalez', email: 'maria@example.com', password: userPassword, admin: false, created_at: new Date() }
    ]);

    await queryInterface.bulkInsert('user_roles', [
      { id: require('uuid').v4(), user_id: adminId, role: 'admin', created_at: new Date() },
      { id: require('uuid').v4(), user_id: userId, role: 'customer', created_at: new Date() },
      { id: require('uuid').v4(), user_id: user2Id, role: 'customer', created_at: new Date() }
    ]);

    // seed dishes (10)
    await queryInterface.bulkInsert('dishes', [
      { tipo: 'principal', nombre: 'Hamburguesa Clásica', precio: 300, descripcion: 'Carne, queso, lechuga, tomate', imagen_url: null, disponible: true, created_at: new Date() },
      { tipo: 'principal', nombre: 'Cheeseburger', precio: 350, descripcion: 'Carne y doble queso', disponible: true, created_at: new Date() },
      { tipo: 'combo', nombre: 'Combo Clásico', precio: 600, descripcion: 'Hamburguesa + papas + bebida', disponible: true, created_at: new Date() },
      { tipo: 'combo', nombre: 'Combo Doble', precio: 850, descripcion: 'Doble hamburguesa + papas + bebida', disponible: true, created_at: new Date() },
      { tipo: 'postre', nombre: 'Helado', precio: 200, descripcion: 'Helado de vainilla', disponible: true, created_at: new Date() },
      { tipo: 'postre', nombre: 'Brownie', precio: 220, descripcion: 'Brownie con salsa de chocolate', disponible: true, created_at: new Date() },
      { tipo: 'bebida', nombre: 'Coca Cola', precio: 150, descripcion: 'Gaseosa 500ml', disponible: true, created_at: new Date() },
      { tipo: 'bebida', nombre: 'Agua', precio: 100, descripcion: 'Agua mineral 500ml', disponible: true, created_at: new Date() },
      { tipo: 'principal', nombre: 'Veggie Burger', precio: 320, descripcion: 'Hamburguesa vegetal con lechuga', disponible: true, created_at: new Date() },
      { tipo: 'principal', nombre: 'Americana', precio: 380, descripcion: 'Bacon, queso, lechuga', disponible: true, created_at: new Date() }
    ]);

    // load dishes to create 2 orders
    const dishes = await queryInterface.sequelize.query('SELECT id, precio FROM dishes LIMIT 10', { type: queryInterface.sequelize.QueryTypes.SELECT });

    // create two orders for userId
    const numero1 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    const numero2 = Math.floor(Math.random() * 10000).toString().padStart(4, '0');

    const order1Items = [ { dishIndex: 0, cantidad: 2 }, { dishIndex: 2, cantidad: 1 } ];
    const order2Items = [ { dishIndex: 1, cantidad: 1 }, { dishIndex: 5, cantidad: 2 } ];

    const total1 = order1Items.reduce((acc,i) => acc + dishes[i.dishIndex].precio * i.cantidad, 0);
    const total2 = order2Items.reduce((acc,i) => acc + dishes[i.dishIndex].precio * i.cantidad, 0);

    const [order1] = await queryInterface.bulkInsert('orders', [
      { user_id: userId, total: total1, numero_orden: numero1, created_at: new Date(), estado: 'pendiente' }
    ], { returning: ['id'] });

    const [order2] = await queryInterface.bulkInsert('orders', [
      { user_id: userId, total: total2, numero_orden: numero2, created_at: new Date(), estado: 'aceptado' }
    ], { returning: ['id'] });

    // depending on DB returning behavior ensure to fetch last inserted
    const orderRecords = await queryInterface.sequelize.query('SELECT id FROM orders ORDER BY id DESC LIMIT 2', { type: queryInterface.sequelize.QueryTypes.SELECT });
    const createdOrders = orderRecords.map(r => r.id).slice(0, 2);

    // create order items for those orders
    const orderItems = [];
    // first order - newest might be orderRecords[0]
    orderItems.push({ order_id: createdOrders[1], dish_id: dishes[0].id, cantidad: 2, precio_unitario: dishes[0].precio });
    orderItems.push({ order_id: createdOrders[1], dish_id: dishes[2].id, cantidad: 1, precio_unitario: dishes[2].precio });

    orderItems.push({ order_id: createdOrders[0], dish_id: dishes[1].id, cantidad: 1, precio_unitario: dishes[1].precio });
    orderItems.push({ order_id: createdOrders[0], dish_id: dishes[5].id, cantidad: 2, precio_unitario: dishes[5].precio });

    await queryInterface.bulkInsert('order_items', orderItems);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('order_items', null, {});
    await queryInterface.bulkDelete('orders', null, {});
    await queryInterface.bulkDelete('dishes', null, {});
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('profiles', null, {});
  }
};
