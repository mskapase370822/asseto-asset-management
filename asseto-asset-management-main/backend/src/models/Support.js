import mongoose from 'mongoose';

const supportSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const Support = mongoose.model('Support', supportSchema);
export default Support;
