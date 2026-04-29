import License from '../models/License.js';
import AssignLicense from '../models/AssignLicense.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listLicenses = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, is_deleted: { $ne: true } };

    if (search) {
      query.$or = [{ name: { $regex: search, $options: 'i' } }];
    }

    const total = await License.countDocuments(query);
    const licenses = await License.find(query)
      .populate('license_type', 'name')
      .populate('vendor', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: licenses, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addLicense = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const license = await License.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
};

export const getLicenseDetails = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const license = await License.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } })
      .populate('license_type')
      .populate('vendor');

    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    return res.json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
};

export const updateLicense = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const license = await License.findOneAndUpdate(
      { _id: req.params.id, organization: orgId, is_deleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    return res.json({ success: true, data: license });
  } catch (err) {
    next(err);
  }
};

export const softDeleteLicense = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const license = await License.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      { is_deleted: true },
      { new: true }
    );
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });
    return res.json({ success: true, message: 'License deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const assignLicense = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const { user: userId, notes } = req.body;

    const license = await License.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!license) return res.status(404).json({ success: false, message: 'License not found' });

    const activeAssignments = await AssignLicense.countDocuments({ license: license._id, is_active: true });
    if (license.seats && activeAssignments >= license.seats) {
      return res.status(400).json({ success: false, message: 'No seats available for this license' });
    }

    const assignment = await AssignLicense.create({
      license: license._id,
      user: userId,
      notes,
      organization: orgId,
    });

    if (activeAssignments + 1 >= license.seats) {
      license.is_assigned = true;
      await license.save();
    }

    return res.status(201).json({ success: true, data: assignment });
  } catch (err) {
    next(err);
  }
};

export const unassignLicense = async (req, res, next) => {
  try {
    const { user: userId } = req.body;

    const assignment = await AssignLicense.findOneAndUpdate(
      { license: req.params.id, user: userId, is_active: true },
      { is_active: false },
      { new: true }
    );

    if (!assignment) return res.status(404).json({ success: false, message: 'Active assignment not found' });

    await License.findByIdAndUpdate(req.params.id, { is_assigned: false });

    return res.json({ success: true, message: 'License unassigned successfully' });
  } catch (err) {
    next(err);
  }
};
