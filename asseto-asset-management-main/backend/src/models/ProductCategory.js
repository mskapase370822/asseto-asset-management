import mongoose from 'mongoose';

const productCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductCategory' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);
export default ProductCategory;
