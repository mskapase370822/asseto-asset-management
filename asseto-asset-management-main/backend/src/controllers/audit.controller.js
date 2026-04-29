import Audit from '../models/Audit.js';
import Asset from '../models/Asset.js';
import AssignAsset from '../models/AssignAsset.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listPendingAudits = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, status: 'Pending' };
    const total = await Audit.countDocuments(query);
    const audits = await Audit.find(query)
      .populate('asset', 'name tag')
      .populate('assigned_to', 'full_name email')
      .populate('audited_by', 'full_name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: audits, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const listCompletedAudits = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, status: 'Completed' };
    const total = await Audit.countDocuments(query);
    const audits = await Audit.find(query)
      .populate('asset', 'name tag')
      .populate('assigned_to', 'full_name email')
      .populate('audited_by', 'full_name email')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: audits, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addAudit = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const audit = await Audit.create({
      ...req.body,
      organization: orgId,
      audited_by: req.user._id,
      status: 'Completed',
    });
    return res.status(201).json({ success: true, data: audit });
  } catch (err) {
    next(err);
  }
};

export const getAuditDetails = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const audit = await Audit.findOne({ _id: req.params.id, organization: orgId })
      .populate('asset')
      .populate('assigned_to', 'full_name email')
      .populate('audited_by', 'full_name email');

    if (!audit) return res.status(404).json({ success: false, message: 'Audit not found' });
    return res.json({ success: true, data: audit });
  } catch (err) {
    next(err);
  }
};

export const getTagsList = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const assets = await Asset.find({ organization: orgId, is_deleted: { $ne: true } })
      .select('tag name status');
    return res.json({ success: true, data: assets });
  } catch (err) {
    next(err);
  }
};

export const getAssignedUser = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const asset = await Asset.findOne({ tag: req.params.tag, organization: orgId, is_deleted: { $ne: true } });
    if (!asset) return res.status(404).json({ success: false, message: 'Asset not found for this tag' });

    const assignment = await AssignAsset.findOne({ asset: asset._id, is_active: true })
      .populate('user', 'full_name email profile_pic employee_id');

    return res.json({ success: true, data: assignment?.user || null });
  } catch (err) {
    next(err);
  }
};
