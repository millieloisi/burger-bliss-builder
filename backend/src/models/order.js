module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user_id: { type: DataTypes.UUID, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    estado: { type: DataTypes.ENUM('pendiente', 'aceptado', 'en_camino', 'entregado'), defaultValue: 'pendiente' },
    tipo_entrega: { type: DataTypes.ENUM('delivery', 'takeaway', 'dine_in'), defaultValue: 'takeaway' },
    numero_mesa: { type: DataTypes.INTEGER },
    direccion_entrega: { type: DataTypes.TEXT },
    total: { type: DataTypes.INTEGER, allowNull: false },
    cupon_id: { type: DataTypes.INTEGER },
    numero_orden: { type: DataTypes.STRING(10), unique: true, allowNull: false },
    qr_code: { type: DataTypes.TEXT }
  }, {
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Order;
};
