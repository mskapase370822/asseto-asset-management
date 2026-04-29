import mongoose from 'mongoose';

const assignLicenseSchema = new mongoose.Schema(
  {
    license: { type: mongoose.Schema.Types.ObjectId, ref: 'License', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignment_date: { type: Date, default: Date.now },
    notes: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const AssignLicense = mongoose.model('AssignLicense', assignLicenseSchema);
export default AssignLicense;
