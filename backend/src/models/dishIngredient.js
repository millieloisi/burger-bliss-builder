module.exports = (sequelize, DataTypes) => {
  const DishIngredient = sequelize.define('DishIngredient', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    dish_id: { type: DataTypes.INTEGER, allowNull: false },
    ingredient_id: { type: DataTypes.INTEGER, allowNull: false },
    incluido: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, {
    tableName: 'dish_ingredients',
    timestamps: false,
    indexes: [{ unique: true, fields: ['dish_id', 'ingredient_id'] }]
  });

  return DishIngredient;
};
