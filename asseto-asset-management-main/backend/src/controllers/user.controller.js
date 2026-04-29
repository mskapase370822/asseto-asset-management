import User from '../models/User.js';
import Role from '../models/Role.js';

export const listUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', is_active, access_level } = req.query;
    const orgId = req.user.organization?._id || req.user.organization;

    const query = { organization: orgId, is_deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { full_name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { employee_id: { $regex: search, $options: 'i' } },
      ];
    }

    if (is_active !== undefined) query.is_active = is_active === 'true';
    if (access_level) query.access_level = access_level;

    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password -totp_secret -password_reset_token -password_reset_expires')
      .populate('role', 'name')
      .populate('department', 'name')
      .populate('location', 'office_name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({
      success: true,
      data: users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
};

export const addUser = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const { email, password, full_name, username, phone, employee_id, department, location, role, access_level } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      email,
      password,
      full_name,
      username,
      phone,
      employee_id,
      department,
      location,
      role,
      access_level,
      organization: orgId,
    });

    const userObj = user.toObject();
    delete userObj.password;

    return res.status(201).json({ success: true, data: userObj });
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const user = await User.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } })
      .select('-password -totp_secret -password_reset_token -password_reset_expires')
      .populate('role')
      .populate('department')
      .populate('location');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const allowedFields = ['full_name', 'username', 'phone', 'employee_id', 'department', 'location', 'role', 'access_level', 'is_active', 'notification_email', 'notification_browser', 'notification_slack', 'notification_inapp'];

    const updates = {};
    allowedFields.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

    if (req.file) updates.profile_pic = req.file.path;

    const user = await User.findOneAndUpdate(
      { _id: req.params.id, organization: orgId, is_deleted: { $ne: true } },
      updates,
      { new: true, runValidators: true }
    ).select('-password -totp_secret -password_reset_token -password_reset_expires');

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const softDeleteUser = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      { is_deleted: true, is_active: false },
      { new: true }
    );
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    return res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const searchUsers = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const orgId = req.user.organization?._id || req.user.organization;

    const users = await User.find({
      organization: orgId,
      is_deleted: { $ne: true },
      $or: [
        { full_name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { username: { $regex: q, $options: 'i' } },
      ],
    })
      .select('full_name email username profile_pic employee_id')
      .limit(20);

    return res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -totp_secret -password_reset_token -password_reset_expires')
      .populate('role')
      .populate('department')
      .populate('location')
      .populate('organization');

    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const getRoles = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const roles = await Role.find({ organization: orgId });
    return res.json({ success: true, data: roles });
  } catch (err) {
    next(err);
  }
};

export const resetUserPassword = async (req, res, next) => {
  try {
    const orgId = req.user.organization?._id || req.user.organization;
    const { new_password } = req.body;

    const user = await User.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    user.password = new_password;
    await user.save();

    return res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};
