import Product from '../models/Product.js';
import ProductType from '../models/ProductType.js';
import ProductCategory from '../models/ProductCategory.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const listProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category, type } = req.query;
    const orgId = getOrgId(req);

    const query = { organization: orgId, is_deleted: { $ne: true } };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
        { model: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = category;
    if (type) query.type = type;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('type', 'name')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    return res.json({ success: true, data: products, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const product = await Product.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const getProductDetails = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const product = await Product.findOne({ _id: req.params.id, organization: orgId, is_deleted: { $ne: true } })
      .populate('category')
      .populate('type');

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, organization: orgId, is_deleted: { $ne: true } },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, data: product });
  } catch (err) {
    next(err);
  }
};

export const softDeleteProduct = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      { is_deleted: true },
      { new: true }
    );
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    return res.json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req, res, next) => {
  try {
    const { q = '' } = req.query;
    const orgId = getOrgId(req);

    const products = await Product.find({
      organization: orgId,
      is_deleted: { $ne: true },
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { manufacturer: { $regex: q, $options: 'i' } },
        { model: { $regex: q, $options: 'i' } },
      ],
    })
      .select('name manufacturer model')
      .limit(20);

    return res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};

export const getProductsDropdown = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const products = await Product.find({ organization: orgId, is_deleted: { $ne: true } })
      .select('_id name');
    return res.json({ success: true, data: products });
  } catch (err) {
    next(err);
  }
};
