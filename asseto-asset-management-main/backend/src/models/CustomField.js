import mongoose from 'mongoose';

const customFieldSchema = new mongoose.Schema(
  {
    entity_type: { type: String, enum: ['Asset', 'Product', 'Vendor'] },
    field_name: { type: String, required: true, trim: true },
    field_value: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    entity_id: { type: String },
  },
  { timestamps: true }
);

const CustomField = mongoose.model('CustomField', customFieldSchema);
export default CustomField;
