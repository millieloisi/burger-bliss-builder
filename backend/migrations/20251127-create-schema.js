'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { UUID, UUIDV4, STRING, INTEGER, BOOLEAN, TEXT, DATE, ENUM, JSONB } = Sequelize;

    // enums
    await queryInterface.sequelize.query("CREATE TYPE app_role AS ENUM ('admin', 'customer')");
    await queryInterface.sequelize.query("CREATE TYPE dish_type AS ENUM ('principal', 'combo', 'postre', 'bebida')");
    await queryInterface.sequelize.query("CREATE TYPE order_status AS ENUM ('pendiente', 'aceptado', 'en_camino', 'entregado')");
    await queryInterface.sequelize.query("CREATE TYPE order_type AS ENUM ('delivery', 'takeaway', 'dine_in')");

    // profiles
    await queryInterface.createTable('profiles', {
      id: { type: UUID, allowNull: false, primaryKey: true, defaultValue: UUIDV4 },
      nombre: { type: STRING(50), allowNull: false },
      apellido: { type: STRING(50), allowNull: false },
      email: { type: STRING(256), allowNull: false, unique: true },
      password: { type: STRING(256), allowNull: false },
      admin: { type: BOOLEAN, defaultValue: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('user_roles', {
      id: { type: UUID, primaryKey: true, defaultValue: UUIDV4 },
      user_id: { type: UUID, allowNull: false, references: { model: 'profiles', key: 'id' }, onDelete: 'CASCADE' },
      role: { type: 'app_role', allowNull: false },
      created_at: { type: DATE, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('dishes', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      tipo: { type: 'dish_type', allowNull: false },
      nombre: { type: STRING(70), allowNull: false },
      precio: { type: INTEGER, allowNull: false },
      descripcion: { type: STRING(400) },
      imagen_url: { type: TEXT },
      disponible: { type: BOOLEAN, defaultValue: true },
      created_at: { type: DATE, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('ingredients', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      nombre: { type: STRING(50), allowNull: false },
      precio_extra: { type: INTEGER, defaultValue: 0 },
      disponible: { type: BOOLEAN, defaultValue: true }
    });

    await queryInterface.createTable('dish_ingredients', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      dish_id: { type: INTEGER, references: { model: 'dishes', key: 'id' }, onDelete: 'CASCADE' },
      ingredient_id: { type: INTEGER, references: { model: 'ingredients', key: 'id' }, onDelete: 'CASCADE' },
      incluido: { type: BOOLEAN, defaultValue: true }
    });

    await queryInterface.addConstraint('dish_ingredients', {
      type: 'unique',
      fields: ['dish_id', 'ingredient_id'],
      name: 'unique_dish_ingredient'
    });

    await queryInterface.createTable('coupons', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      codigo: { type: STRING(20), allowNull: false, unique: true },
      descuento_porcentaje: { type: INTEGER },
      activo: { type: BOOLEAN, defaultValue: true },
      created_at: { type: DATE, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('orders', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: UUID, allowNull: false, references: { model: 'profiles', key: 'id' }, onDelete: 'CASCADE' },
      fecha: { type: DATE, defaultValue: Sequelize.literal('NOW()') },
      estado: { type: 'order_status', defaultValue: 'pendiente' },
      tipo_entrega: { type: 'order_type', defaultValue: 'takeaway' },
      numero_mesa: { type: INTEGER },
      direccion_entrega: { type: TEXT },
      total: { type: INTEGER, allowNull: false },
      cupon_id: { type: INTEGER, references: { model: 'coupons', key: 'id' } },
      numero_orden: { type: STRING(10), allowNull: false, unique: true },
      qr_code: { type: TEXT },
      created_at: { type: DATE, defaultValue: Sequelize.literal('NOW()') }
    });

    await queryInterface.createTable('order_items', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      order_id: { type: INTEGER, allowNull: false, references: { model: 'orders', key: 'id' }, onDelete: 'CASCADE' },
      dish_id: { type: INTEGER, allowNull: false, references: { model: 'dishes', key: 'id' } },
      cantidad: { type: INTEGER, allowNull: false, defaultValue: 1 },
      precio_unitario: { type: INTEGER, allowNull: false },
      personalizaciones: { type: JSONB }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('order_items');
    await queryInterface.dropTable('orders');
    await queryInterface.dropTable('coupons');
    await queryInterface.dropTable('dish_ingredients');
    await queryInterface.dropTable('ingredients');
    await queryInterface.dropTable('dishes');
    await queryInterface.dropTable('user_roles');
    await queryInterface.dropTable('profiles');

    await queryInterface.sequelize.query('DROP TYPE IF EXISTS app_role');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS dish_type');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS order_status');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS order_type');
  }
};
