import mongoose from 'mongoose';

const userNotificationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notification: { type: mongoose.Schema.Types.ObjectId, ref: 'Notification' },
    is_seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const UserNotification = mongoose.model('UserNotification', userNotificationSchema);
export default UserNotification;
