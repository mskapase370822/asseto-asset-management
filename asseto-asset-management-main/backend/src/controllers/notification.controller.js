import UserNotification from '../models/UserNotification.js';

export const listNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user._id;

    const total = await UserNotification.countDocuments({ user: userId });
    const notifications = await UserNotification.find({ user: userId })
      .populate('notification')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.json({ success: true, data: notifications, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    next(err);
  }
};

export const markAsRead = async (req, res, next) => {
  try {
    const userNotif = await UserNotification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { is_seen: true },
      { new: true }
    );
    if (!userNotif) return res.status(404).json({ success: false, message: 'Notification not found' });
    return res.json({ success: true, data: userNotif });
  } catch (err) {
    next(err);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await UserNotification.updateMany({ user: req.user._id, is_seen: false }, { is_seen: true });
    return res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req, res, next) => {
  try {
    const count = await UserNotification.countDocuments({ user: req.user._id, is_seen: false });
    return res.json({ success: true, data: { count } });
  } catch (err) {
    next(err);
  }
};
