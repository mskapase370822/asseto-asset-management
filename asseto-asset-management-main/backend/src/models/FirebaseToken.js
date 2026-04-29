import mongoose from 'mongoose';

const firebaseTokenSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    token: { type: String },
  },
  { timestamps: true }
);

const FirebaseToken = mongoose.model('FirebaseToken', firebaseTokenSchema);
export default FirebaseToken;
