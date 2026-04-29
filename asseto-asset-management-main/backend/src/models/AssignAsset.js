import mongoose from 'mongoose';

const assignAssetSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assigned_date: { type: Date, default: Date.now },
    unassigned_date: { type: Date },
    notes: { type: String },
    is_active: { type: Boolean, default: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    assigned_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

const AssignAsset = mongoose.model('AssignAsset', assignAssetSchema);
export default AssignAsset;
