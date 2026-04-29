import mongoose from 'mongoose';

const brandingImagesSchema = new mongoose.Schema(
  {
    logo: { type: String },
    favicon: { type: String },
    login_page_logo: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', unique: true },
  },
  { timestamps: true }
);

const BrandingImages = mongoose.model('BrandingImages', brandingImagesSchema);
export default BrandingImages;
