module.exports = (sequelize, DataTypes) => {
  const Dish = sequelize.define('Dish', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    tipo: { type: DataTypes.ENUM('principal', 'combo', 'postre', 'bebida'), allowNull: false },
    nombre: { type: DataTypes.STRING(70), allowNull: false },
    precio: { type: DataTypes.INTEGER, allowNull: false },
    descripcion: { type: DataTypes.STRING(400) },
    imagen_url: { type: DataTypes.TEXT },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'dishes',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Dish;
};
