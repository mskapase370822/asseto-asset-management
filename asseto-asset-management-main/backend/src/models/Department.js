import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    contact_person_name: { type: String, trim: true },
    contact_person_email: { type: String, trim: true },
    contact_person_phone: { type: String, trim: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const Department = mongoose.model('Department', departmentSchema);
export default Department;
