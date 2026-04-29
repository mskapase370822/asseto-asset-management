import Vendor from '../models/Vendor.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listVendors = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, is_deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { contact_person: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Vendor.countDocuments(query);
    const vendors = await Vendor.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: vendors, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addVendor = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const vendor = await Vendor.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

export const getVendorDetails = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const vendor = await Vendor.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } });
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    return res.json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

export const updateVendor = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, organization: orgId, is_deleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    return res.json({ success: true, data: vendor });
  } catch (err) {
    next(err);
  }
};

export const softDeleteVendor = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const vendor = await Vendor.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      { is_deleted: true },
      { new: true }
    );
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });
    return res.json({ success: true, message: 'Vendor deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const searchVendors = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const orgId = getOrgId(req);

    const vendors = await Vendor.find({
      organization: orgId,
      is_deleted: { $ne: true },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
        { contact_person: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name email contact_person phone')
      .limit(20);

    return res.json({ success: true, data: vendors });
  } catch (err) {
    next(err);
  }
};

export const getVendorsDropdown = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const vendors = await Vendor.find({ organization: orgId, is_deleted: { $ne: true } })
      .select('_id name');
    return res.json({ success: true, data: vendors });
  } catch (err) {
    next(err);
  }
};
