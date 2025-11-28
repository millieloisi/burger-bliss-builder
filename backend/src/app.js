const express = require('express');
const bodyParser = require('express').json;
const cors = require('cors');
const { sequelize } = require('./models');
const platos = require('./routes/platos');
const auth = require('./routes/auth');
const pedidos = require('./routes/pedidos');
const coupons = require('./routes/coupons');
const ingredients = require('./routes/ingredients');

const app = express();
// enable CORS so frontend (vite) at different origin can call the API
app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(bodyParser());

app.use('/platos', platos);
app.use('/auth', auth);
app.use('/pedidos', pedidos);
app.use('/coupons', coupons);
app.use('/ingredients', ingredients);

app.get('/', (req, res) => res.json({ message: 'Burger Bliss API (Sequelize)' }));

// optional sync if no migrations are run
if (process.env.FORCE_SYNC === 'true') {
  sequelize.sync({ alter: true }).then(() => console.log('DB synced'));
}

module.exports = app;
