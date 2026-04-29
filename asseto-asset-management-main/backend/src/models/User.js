import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    username: { type: String, trim: true },
    full_name: { type: String, trim: true },
    phone: { type: String, trim: true },
    profile_pic: { type: String },
    employee_id: { type: String, trim: true },
    password: { type: String, required: true },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
    location: { type: mongoose.Schema.Types.ObjectId, ref: 'Location' },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    access_level: {
      type: String,
      enum: ['superuser', 'admin', 'user'],
      default: 'user',
    },
    is_active: { type: Boolean, default: true },
    is_deleted: { type: Boolean, default: false },
    two_factor_auth: { type: Boolean, default: false },
    totp_secret: { type: String },
    notification_email: { type: Boolean, default: true },
    notification_browser: { type: Boolean, default: false },
    notification_slack: { type: Boolean, default: false },
    notification_inapp: { type: Boolean, default: true },
    password_reset_token: { type: String },
    password_reset_expires: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
