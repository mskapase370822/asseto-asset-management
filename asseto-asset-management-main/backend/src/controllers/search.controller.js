import Asset from '../models/Asset.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Vendor from '../models/Vendor.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const globalSearch = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const orgId = getOrgId(req);

    if (!q.trim()) {
      return res.json({ success: true, data: { assets: [], users: [], products: [], vendors: [] } });
    }

    const searchRegex = { $regex: q, $options: 'i' };
    const orgFilter = { organization: orgId };

    const [assets, users, products, vendors] = await Promise.all([
      Asset.find({
        ...orgFilter,
        is_deleted: { $ne: true },
        $or: [{ name: searchRegex }, { tag: searchRegex }, { serial_no: searchRegex }],
      })
        .select('name tag serial_no status')
        .limit(5),

      User.find({
        ...orgFilter,
        is_deleted: { $ne: true },
        $or: [{ full_name: searchRegex }, { email: searchRegex }, { username: searchRegex }],
      })
        .select('full_name email username profile_pic')
        .limit(5),

      Product.find({
        ...orgFilter,
        is_deleted: { $ne: true },
        $or: [{ name: searchRegex }, { manufacturer: searchRegex }, { model: searchRegex }],
      })
        .select('name manufacturer model')
        .limit(5),

      Vendor.find({
        ...orgFilter,
        is_deleted: { $ne: true },
        $or: [{ name: searchRegex }, { email: searchRegex }, { contact_person: searchRegex }],
      })
        .select('name email contact_person')
        .limit(5),
    ]);

    return res.json({ success: true, data: { assets, users, products, vendors } });
  } catch (err) {
    next(err);
  }
};
