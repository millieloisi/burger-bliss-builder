module.exports = (sequelize, DataTypes) => {
  const Coupon = sequelize.define('Coupon', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    codigo: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    descuento_porcentaje: { type: DataTypes.INTEGER, validate: { min: 0, max: 100 } },
    activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'coupons',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Coupon;
};
