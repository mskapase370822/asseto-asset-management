import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    manufacturer: { type: String, trim: true },
    model: { type: String, trim: true },
    eol_date: { type: Date },
    product_picture: { type: String },
    description: { type: String },
    audit_interval: { type: Number },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    type: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductType' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    is_deleted: { type: Boolean, default: false },
    images: [{ type: String }],
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);
export default Product;
