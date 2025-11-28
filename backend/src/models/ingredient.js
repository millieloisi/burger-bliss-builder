module.exports = (sequelize, DataTypes) => {
  const Ingredient = sequelize.define('Ingredient', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(50), allowNull: false },
    precio_extra: { type: DataTypes.INTEGER, defaultValue: 0 },
    disponible: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'ingredients',
    timestamps: false
  });

  return Ingredient;
};
