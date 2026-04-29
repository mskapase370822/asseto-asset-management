import mongoose from 'mongoose';

const assetSchema = new mongoose.Schema(
  {
    tag: { type: String, unique: true, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    serial_no: { type: String, trim: true },
    price: { type: Number },
    status: {
      type: String,
      enum: ['Available', 'Assigned', 'Repair Required', 'Lost', 'Stolen', 'Broken', 'Ready to Deploy'],
      default: 'Available',
    },
    purchase_date: { type: Date },
    warranty_expiry_date: { type: Date },
    purchase_type: { type: String, enum: ['New', 'Refurbished', 'Leased'] },
    description: { type: String },
    is_assigned: { type: Boolean, default: false },
    is_deleted: { type: Boolean, default: false },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    images: [{ type: String }],
    specifications: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    history: [
      {
        action: { type: String },
        changed_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        changed_at: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const Asset = mongoose.model('Asset', assetSchema);
export default Asset;
