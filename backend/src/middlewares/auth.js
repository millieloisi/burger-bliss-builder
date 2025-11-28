const jwt = require('jsonwebtoken');
const { Profile } = require('../models');

const jwtSecret = process.env.JWT_SECRET || 'changeme';

async function authenticate(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Token missing or invalid' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, jwtSecret);
    const user = await Profile.findByPk(payload.id);
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user; // full profile model
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ message: 'Not authenticated' });
  if (!req.user.admin) return res.status(403).json({ message: 'Admin required' });
  return next();
}

module.exports = { authenticate, requireAdmin };
