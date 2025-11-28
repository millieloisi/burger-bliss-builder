const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/burger_bliss';

const useSSL = (process.env.PGSSLMODE === 'require') || (connectionString && connectionString.includes('neon'));

const sequelizeOptions = {
  dialect: 'postgres',
  logging: false
};

if (useSSL) {
  sequelizeOptions.dialectOptions = {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  };
}

const sequelize = new Sequelize(connectionString, sequelizeOptions);

const Profile = require('./profile')(sequelize, DataTypes);
const UserRole = require('./userRole')(sequelize, DataTypes);
const Dish = require('./dish')(sequelize, DataTypes);
const Ingredient = require('./ingredient')(sequelize, DataTypes);
const DishIngredient = require('./dishIngredient')(sequelize, DataTypes);
const Coupon = require('./coupon')(sequelize, DataTypes);
const Order = require('./order')(sequelize, DataTypes);
const OrderItem = require('./orderItem')(sequelize, DataTypes);

// associations
Profile.hasMany(UserRole, { foreignKey: 'user_id', as: 'roles' });
UserRole.belongsTo(Profile, { foreignKey: 'user_id' });

Dish.belongsToMany(Ingredient, { through: DishIngredient, foreignKey: 'dish_id', otherKey: 'ingredient_id' });
Ingredient.belongsToMany(Dish, { through: DishIngredient, foreignKey: 'ingredient_id', otherKey: 'dish_id' });

Order.belongsTo(Profile, { foreignKey: 'user_id' });
Profile.hasMany(Order, { foreignKey: 'user_id', as: 'orders' });

Order.hasMany(OrderItem, { foreignKey: 'order_id', as: 'items' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Dish.hasMany(OrderItem, { foreignKey: 'dish_id' });
OrderItem.belongsTo(Dish, { foreignKey: 'dish_id' });

module.exports = {
  sequelize,
  Sequelize,
  Profile,
  UserRole,
  Dish,
  Ingredient,
  DishIngredient,
  Coupon,
  Order,
  OrderItem
};
