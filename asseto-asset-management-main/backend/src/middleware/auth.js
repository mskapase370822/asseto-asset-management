import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorized, no token' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select('-password -totp_secret -password_reset_token -password_reset_expires')
      .populate('organization')
      .populate('role')
      .populate('department')
      .populate('location');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    if (!user.is_active || user.is_deleted) {
      return res.status(401).json({ success: false, message: 'User account is deactivated' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next();
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id)
      .select('-password -totp_secret -password_reset_token -password_reset_expires')
      .populate('organization')
      .populate('role');

    if (user && user.is_active && !user.is_deleted) {
      req.user = user;
    }
    next();
  } catch (err) {
    next();
  }
};
