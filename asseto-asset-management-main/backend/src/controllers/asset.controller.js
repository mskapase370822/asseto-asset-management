import Asset from '../models/Asset.js';
import AssignAsset from '../models/AssignAsset.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import UserNotification from '../models/UserNotification.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listAssets = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', status, product, vendor, location } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, is_deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { tag: { $regex: search, $options: 'i' } },
        { serial_no: { $regex: search, $options: 'i' } },
      ];
    }

    if (status) query.status = status;
    if (product) query.product = product;
    if (vendor) query.vendor = vendor;
    if (location) query.location = location;

    const total = await Asset.countDocuments(query);
    const assets = await Asset.find(query)
      .populate('product', 'name')
      .populate('vendor', 'name')
      .populate('location', 'office_name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: assets, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addAsset = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

export const getAssetDetails = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } })
      .populate('product')
      .populate('vendor')
      .populate('location')
      .populate('history.changed_by', 'full_name email');

    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

export const updateAsset = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, organization: orgId, is_deleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

export const softDeleteAsset = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      { is_deleted: true },
      { new: true }
    );
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });
    return res.json({ success: true, message: 'Asset deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const searchAssets = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const orgId = getOrgId(req);

    const assets = await Asset.find({
      organization: orgId,
      is_deleted: { $ne: true },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { tag: { $regex: q, $options: 'i' } },
        { serial_no: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name tag serial_no status')
      .limit(20);

    return res.json({ success: true, data: assets });
  } catch (err) {
    next(err);
  }
};

export const assignAsset = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const { user: userId, notes } = req.body;

    const asset = await Asset.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });

    if (asset.is_assigned) {
      return res.status(400).json({ success: false, message: 'Asset is already assigned' });
    }

    const assignment = await AssignAsset.create({
      asset: asset._id,
      user: userId,
      notes,
      organization: orgId,
      assigned_by: req.user._id,
    });

    asset.is_assigned = true;
    asset.status = 'Assigned';
    asset.history.push({ action: 'Assigned', changed_by: req.user._id, note: notes });
    await asset.save();

    return res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

export const unassignAsset = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);

    const asset = await Asset.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });

    const assignment = await AssignAsset.findOneAndUpdate(
      { asset: asset._id, is_active: true },
      { is_active: false, unassigned_date: new Date() },
      { new: true }
    );

    if (!assignment) return res.status(400).json({ success: false, message: 'Asset is not assigned' });

    asset.is_assigned = false;
    asset.status = 'Available';
    asset.history.push({ action: 'Unassigned', changed_by: req.user._id });
    await asset.save();

    return res.json({ success: true, message: 'Asset unassigned successfully' });
  } catch (err) {
    next(err);
  }
};

export const updateAssetStatus = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const { status, note } = req.body;

    const asset = await Asset.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found' });

    asset.status = status;
    asset.history.push({ action: `Status changed to ${status}`, changed_by: req.user._id, note });
    await asset.save();

    return res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const notifications = await UserNotification.find({ user: userId })
      .populate('notification')
      .sort({ createdAt: -1 })
      .limit(50);

    return res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req, res, next) => {
  try {
    await UserNotification.updateMany({ user: req.user._id, is_seen: false }, { is_seen: true });
    return res.json({ success: true, message: 'Notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

export const getWarrantyExpiredFlag = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiredCount = await Asset.countDocuments({
      organization: orgId,
      is_deleted: { $ne: true },
      warranty_expiry_date: { $lte: today },
    });

    const expiringCount = await Asset.countDocuments({
      organization: orgId,
      is_deleted: { $ne: true },
      warranty_expiry_date: { $gt: today, $lte: thirtyDaysFromNow },
    });

    return res.json({ success: true, data: { expiredCount, expiringCount } });
  } catch (err) {
    next(err);
  }
};

export const scanBarcode = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.findOne({ tag: req.params.tag, organization: orgId, is_deleted: { $ne: true } })
      .populate('product', 'name')
      .populate('vendor', 'name')
      .populate('location', 'office_name');

    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found for this tag' });
    return res.json({ success: true, data: asset });
  } catch (err) {
    next(err);
  }
};

export const getUsersForAssign = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const users = await User.find({ organization: orgId, is_deleted: { $ne: true }, is_active: true })
      .select('full_name email profile_pic employee_id');
    return res.json({ success: true, data: users });
  } catch (err) {
    next(err);
  }
};
