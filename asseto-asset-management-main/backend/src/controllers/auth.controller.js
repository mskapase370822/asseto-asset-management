import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import Organization from '../models/Organization.js';
import { generateSecret, generateQRCode, verifyToken } from '../services/otp.service.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

const signAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRES || '720m' });

const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRES || '30d',
  });

export const register = async (req, res, next) => {
  try {
    const { email, password, full_name, username, organization_name } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ success: false, message: 'Email already registered' });
    }

    let org;
    if (organization_name) {
      org = await Organization.findOne({ name: organization_name });
      if (!org) {
        org = await Organization.create({ name: organization_name });
      }
    }

    const user = await User.create({
      email,
      password,
      full_name,
      username,
      organization: org?._id,
      access_level: org ? 'admin' : 'user',
    });

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    return res.status(201).json({
      success: true,
      data: {
        accessToken,
        refreshToken,
        user: {
          _id: user._id,
          email: user.email,
          full_name: user.full_name,
          username: user.username,
          access_level: user.access_level,
          organization: user.organization,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, is_deleted: { $ne: true } })
      .populate('organization')
      .populate('role')
      .populate('department')
      .populate('location');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.is_active) {
      return res.status(401).json({ success: false, message: 'Account is deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const accessToken = signAccessToken(user._id);
    const refreshToken = signRefreshToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;
    delete userObj.totp_secret;
    delete userObj.password_reset_token;
    delete userObj.password_reset_expires;

    return res.json({
      success: true,
      data: { accessToken, refreshToken, user: userObj },
    });
  } catch (err) {
    next(err);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken: token } = req.body;
    if (!token) {
      return res.status(400).json({ success: false, message: 'Refresh token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || !user.is_active || user.is_deleted) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const accessToken = signAccessToken(user._id);
    return res.json({ success: true, data: { accessToken } });
  } catch (err) {
    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
    next(err);
  }
};

export const logout = async (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully' });
};

export const generateOtp = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { secret, otpauth_url } = generateSecret(user.email);

    user.totp_secret = secret;
    await user.save();

    const qrCode = await generateQRCode(otpauth_url);
    return res.json({ success: true, data: { qrCode, otpauth_url } });
  } catch (err) {
    next(err);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id).select('+totp_secret');

    if (!user.totp_secret) {
      return res.status(400).json({ success: false, message: 'OTP not set up. Generate OTP first.' });
    }

    const isValid = verifyToken(user.totp_secret, token);
    if (!isValid) {
      return res.status(400).json({ success: false, message: 'Invalid OTP token' });
    }

    user.two_factor_auth = true;
    await user.save();

    return res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    next(err);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email, is_deleted: { $ne: true } });

    if (!user) {
      return res.json({ success: true, message: 'If that email exists, a reset link has been sent.' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.password_reset_token = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.password_reset_expires = Date.now() + 60 * 60 * 1000; // 1 hour
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(email, resetUrl);

    return res.json({ success: true, message: 'Password reset email sent.' });
  } catch (err) {
    next(err);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      password_reset_token: hashedToken,
      password_reset_expires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.password_reset_token = undefined;
    user.password_reset_expires = undefined;
    await user.save();

    return res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { current_password, new_password } = req.body;
    const user = await User.findById(req.user._id);

    const isMatch = await user.comparePassword(current_password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = new_password;
    await user.save();

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};
