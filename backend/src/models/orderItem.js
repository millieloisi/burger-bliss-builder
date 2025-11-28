module.exports = (sequelize, DataTypes) => {
  const OrderItem = sequelize.define('OrderItem', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order_id: { type: DataTypes.INTEGER, allowNull: false },
    dish_id: { type: DataTypes.INTEGER, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    precio_unitario: { type: DataTypes.INTEGER, allowNull: false },
    personalizaciones: { type: DataTypes.JSONB }
  }, {
    tableName: 'order_items',
    timestamps: false
  });

  return OrderItem;
};
