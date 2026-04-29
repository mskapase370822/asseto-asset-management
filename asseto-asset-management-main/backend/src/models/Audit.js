import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema(
  {
    asset: { type: mongoose.Schema.Types.ObjectId, ref: 'Asset' },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    condition: {
      type: String,
      enum: ['Excellent', 'Good', 'Fair', 'Bad', 'Retired'],
    },
    notes: { type: String },
    audited_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    images: [{ type: String }],
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    status: {
      type: String,
      enum: ['Pending', 'Completed'],
      default: 'Pending',
    },
  },
  { timestamps: true }
);

const Audit = mongoose.model('Audit', auditSchema);
export default Audit;
