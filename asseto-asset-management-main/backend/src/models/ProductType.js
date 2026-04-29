import mongoose from 'mongoose';

const productTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const ProductType = mongoose.model('ProductType', productTypeSchema);
export default ProductType;
