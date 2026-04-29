import mongoose from 'mongoose';

const licenseTypeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const LicenseType = mongoose.model('LicenseType', licenseTypeSchema);
export default LicenseType;
