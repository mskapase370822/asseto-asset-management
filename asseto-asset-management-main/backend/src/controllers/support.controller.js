import Support from '../models/Support.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listSupport = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId };
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Support.countDocuments(query);
    const faqs = await Support.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: faqs, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addSupport = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const faq = await Support.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const updateSupport = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const faq = await Support.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.json({ success: true, data: faq });
  } catch (err) {
    next(err);
  }
};

export const deleteSupport = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const faq = await Support.findOneAndDelete({ _id: req.params.id, organization: orgId });
    if (!faq) return res.status(404).json({ success: false, message: 'FAQ not found' });
    return res.json({ success: true, message: 'FAQ deleted successfully' });
  } catch (err) {
    next(err);
  }
};
