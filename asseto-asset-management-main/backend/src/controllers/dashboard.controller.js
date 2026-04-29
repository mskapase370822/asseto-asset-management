import Asset from '../models/Asset.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';
import Location from '../models/Location.js';
import AssignAsset from '../models/AssignAsset.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const getAssetStats = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const baseQuery = { organization: orgId, is_deleted: { $ne: true } };

    const [total, available, assigned, repairRequired, lost, stolen, broken, readyToDeploy] = await Promise.all([
      Asset.countDocuments(baseQuery),
      Asset.countDocuments({ ...baseQuery, status: 'Available' }),
      Asset.countDocuments({ ...baseQuery, status: 'Assigned' }),
      Asset.countDocuments({ ...baseQuery, status: 'Repair Required' }),
      Asset.countDocuments({ ...baseQuery, status: 'Lost' }),
      Asset.countDocuments({ ...baseQuery, status: 'Stolen' }),
      Asset.countDocuments({ ...baseQuery, status: 'Broken' }),
      Asset.countDocuments({ ...baseQuery, status: 'Ready to Deploy' }),
    ]);

    return res.json({
      success: true,
      data: { total, available, assigned, repairRequired, lost, stolen, broken, readyToDeploy },
    });
  } catch (err) {
    next(err);
  }
};

export const getUserStats = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const baseQuery = { organization: orgId, is_deleted: { $ne: true } };

    const [total, active, inactive] = await Promise.all([
      User.countDocuments(baseQuery),
      User.countDocuments({ ...baseQuery, is_active: true }),
      User.countDocuments({ ...baseQuery, is_active: false }),
    ]);

    return res.json({ success: true, data: { total, active, inactive } });
  } catch (err) {
    next(err);
  }
};

export const getProductStats = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const total = await Product.countDocuments({ organization: orgId, is_deleted: { $ne: true } });
    return res.json({ success: true, data: { total } });
  } catch (err) {
    next(err);
  }
};

export const getVendorStats = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const total = await Vendor.countDocuments({ organization: orgId, is_deleted: { $ne: true } });
    return res.json({ success: true, data: { total } });
  } catch (err) {
    next(err);
  }
};

export const getLocationStats = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const total = await Location.countDocuments({ organization: orgId });
    return res.json({ success: true, data: { total } });
  } catch (err) {
    next(err);
  }
};

export const getRecentActivity = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);

    const recentAssets = await Asset.find({ organization: orgId, is_deleted: { $ne: true } })
      .select('name tag status createdAt updatedAt')
      .sort({ updatedAt: -1 })
      .limit(5);

    const recentAssignments = await AssignAsset.find({ organization: orgId })
      .populate('asset', 'name tag')
      .populate('user', 'full_name email')
      .populate('assigned_by', 'full_name')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.json({ success: true, data: { recentAssets, recentAssignments } });
  } catch (err) {
    next(err);
  }
};
