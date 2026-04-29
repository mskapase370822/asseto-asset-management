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
  { timestamps: true }
);

const Address = mongoose.model('Address', addressSchema);
export default Address;
