import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    notification_title: { type: String, required: true },
    notification_text: { type: String },
    icon: { type: String },
    link: { type: String },
    notification_type: {
      type: String,
      enum: ['browser', 'email', 'slack', 'inapp'],
      default: 'inapp',
    },
    object_id: { type: String },
    organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
