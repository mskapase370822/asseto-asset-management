import mongoose from 'mongoose';

const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    website: { type: String, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    currency: { type: String, default: 'USD' },
    date_format: { type: String, default: 'MM/DD/YYYY' },
    logo: { type: String },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const Organization = mongoose.model('Organization', organizationSchema);
export default Organization;
