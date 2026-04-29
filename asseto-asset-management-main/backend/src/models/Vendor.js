import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    address_line_one: { type: String, trim: true },
    address_line_two: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    city: { type: String, trim: true },
    pin_code: { type: String, trim: true },
  },
  { _id: false }
);

const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    phone: { type: String, trim: true },
    contact_person: { type: String, trim: true },
    designation: { type: String, trim: true },
    gstin: { type: String, trim: true },
    description: { type: String },
    address: { type: addressSchema },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    is_deleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Vendor = mongoose.model('Vendor', vendorSchema);
export default Vendor;
