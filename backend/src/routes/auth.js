const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Profile, UserRole } = require('../models');

const jwtSecret = process.env.JWT_SECRET || 'changeme';

// register
router.post('/register', async (req, res) => {
  const { nombre, apellido, email, password } = req.body;
  if (!nombre || !apellido || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const existing = await Profile.findOne({ where: { email } });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await Profile.create({ nombre, apellido, email, password: hashed, admin: false });

    // add role
    await UserRole.create({ user_id: user.id, role: 'customer' });

    // auto-login after register: sign a token and return user info
    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: 1800 });

    return res.status(201).json({ token, user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, admin: user.admin } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });

  try {
    const user = await Profile.findOne({ where: { email } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id }, jwtSecret, { expiresIn: 1800 }); // 30 minutes

    return res.json({ token, user: { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, admin: user.admin } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
