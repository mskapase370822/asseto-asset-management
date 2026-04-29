import mongoose from 'mongoose';

const extensionsSchema = new mongoose.Schema(
  {
    entity_name: { type: String },
    status: { type: String, enum: ['Active', 'Inactive'], default: 'Inactive' },
    payment_date: { type: Date },
    valid_from: { type: Date },
    valid_to: { type: Date },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const Extensions = mongoose.model('Extensions', extensionsSchema);
export default Extensions;
