import TagConfiguration from '../models/TagConfiguration.js';
import LocalizationConfiguration from '../models/LocalizationConfiguration.js';
import BrandingImages from '../models/BrandingImages.js';
import Extensions from '../models/Extensions.js';
import SlackConfiguration from '../models/SlackConfiguration.js';
import Department from '../models/Department.js';
import Location from '../models/Location.js';
import ProductType from '../models/ProductType.js';
import ProductCategory from '../models/ProductCategory.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

export const getTagConfig = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    let config = await TagConfiguration.findOne({ organization: orgId });
    if (!config) {
      config = await TagConfiguration.create({ organization: orgId });
    }
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const updateTagConfig = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const config = await TagConfiguration.findOneAndUpdate(
      { organization: orgId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const getLocalization = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    let config = await LocalizationConfiguration.findOne({ organization: orgId });
    if (!config) {
      config = await LocalizationConfiguration.create({ organization: orgId });
    }
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const updateLocalization = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const config = await LocalizationConfiguration.findOneAndUpdate(
      { organization: orgId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const getBranding = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    let branding = await BrandingImages.findOne({ organization: orgId });
    if (!branding) {
      branding = await BrandingImages.create({ organization: orgId });
    }
    return res.json({ success: true, data: branding });
  } catch (err) {
    next(err);
  }
};

export const updateBranding = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const updates = { ...req.body };

    if (req.files) {
      if (req.files.logo) updates.logo = req.files.logo[0].path;
      if (req.files.favicon) updates.favicon = req.files.favicon[0].path;
      if (req.files.login_page_logo) updates.login_page_logo = req.files.login_page_logo[0].path;
    }

    const branding = await BrandingImages.findOneAndUpdate(
      { organization: orgId },
      updates,
      { new: true, upsert: true }
    );
    return res.json({ success: true, data: branding });
  } catch (err) {
    next(err);
  }
};

export const getExtensions = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const extensions = await Extensions.find({ organization: orgId });
    return res.json({ success: true, data: extensions });
  } catch (err) {
    next(err);
  }
};

export const updateExtension = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const ext = await Extensions.findOneAndUpdate(
      { _id: req.params.id, organization: orgId },
      req.body,
      { new: true, runValidators: true }
    );
    if (!ext) return res.status(404).json({ success: false, message: 'Extension not found' });
    return res.json({ success: true, data: ext });
  } catch (err) {
    next(err);
  }
};

export const getSlackConfig = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    let config = await SlackConfiguration.findOne({ organization: orgId });
    if (!config) config = {};
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const updateSlackConfig = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const config = await SlackConfiguration.findOneAndUpdate(
      { organization: orgId },
      req.body,
      { new: true, upsert: true, runValidators: true }
    );
    return res.json({ success: true, data: config });
  } catch (err) {
    next(err);
  }
};

export const generateAutoTag = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    let tagConfig = await TagConfiguration.findOne({ organization: orgId });
    if (!tagConfig) {
      tagConfig = await TagConfiguration.create({ organization: orgId });
    }

    const tag = `${tagConfig.prefix}-${tagConfig.number_suffix}`;

    tagConfig.number_suffix += 1;
    await tagConfig.save();

    return res.json({ success: true, data: { tag } });
  } catch (err) {
    next(err);
  }
};

export const getDepartments = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const departments = await Department.find({ organization: orgId });
    return res.json({ success: true, data: departments });
  } catch (err) {
    next(err);
  }
};

export const createDepartment = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const dept = await Department.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: dept });
  } catch (err) {
    next(err);
  }
};

export const getLocations = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const locations = await Location.find({ organization: orgId });
    return res.json({ success: true, data: locations });
  } catch (err) {
    next(err);
  }
};

export const createLocation = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const loc = await Location.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: loc });
  } catch (err) {
    next(err);
  }
};

export const getProductTypes = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const types = await ProductType.find({ organization: orgId });
    return res.json({ success: true, data: types });
  } catch (err) {
    next(err);
  }
};

export const createProductType = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const type = await ProductType.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: type });
  } catch (err) {
    next(err);
  }
};

export const getProductCategories = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const categories = await ProductCategory.find({ organization: orgId }).populate('parent', 'name');
    return res.json({ success: true, data: categories });
  } catch (err) {
    next(err);
  }
};

export const createProductCategory = async (req, res, next) => {
  try {
    const orgId = getOrgId(req);
    const cat = await ProductCategory.create({ ...req.body, organization: orgId });
    return res.status(201).json({ success: true, data: cat });
  } catch (err) {
    next(err);
  }
};
