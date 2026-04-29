import mongoose from 'mongoose';

const licenseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    seats: { type: Number },
    start_date: { type: Date },
    expiry_date: { type: Date },
    license_key: { type: String },
    notes: { type: String },
    is_assigned: { type: Boolean, default: false },
    license_type: { type: mongoose.Schema.Types.ObjectId, ref: 'LicenseType' },
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor' },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const License = mongoose.model('License', licenseSchema);
export default License;
