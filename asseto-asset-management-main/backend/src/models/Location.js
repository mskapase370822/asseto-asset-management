import mongoose from 'mongoose';

const addressEmbedded = {
  address_line_one: { type: String, trim: true },
  address_line_two: { type: String, trim: true },
  country: { type: String, trim: true },
  state: { type: String, trim: true },
  city: { type: String, trim: true },
  pin_code: { type: String, trim: true },
};

const locationSchema = new mongoose.Schema(
  {
    office_name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: addressEmbedded, _id: false },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const Location = mongoose.model('Location', locationSchema);
export default Location;
