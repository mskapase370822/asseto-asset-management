import cron from 'node-cron';
import Asset from '../models/Asset.js';
import License from '../models/License.js';
import Notification from '../models/Notification.js';
import UserNotification from '../models/UserNotification.js';
import User from '../models/User.js';

const createWarrantyNotifications = async () => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const today = new Date();

    const expiringAssets = await Asset.find({
      is_deleted: { $ne: true },
      warranty_expiry_date: { $gte: today, $lte: thirtyDaysFromNow },
    }).populate('organization');

    for (const asset of expiringAssets) {
      const notification = await Notification.create({
        notification_title: 'Warranty Expiring Soon',
        notification_text: `Asset "${asset.name}" (Tag: ${asset.tag}) warranty expires on ${asset.warranty_expiry_date.toDateString()}.`,
        notification_type: 'inapp',
        object_id: asset._id.toString(),
        organization: asset.organization,
      });

      const admins = await User.find({
        organization: asset.organization,
        is_deleted: { $ne: true },
        is_active: true,
        access_level: { $in: ['superuser', 'admin'] },
      });

      const notifDocs = admins.map((admin) => ({
        user: admin._id,
        notification: notification._id,
      }));
      if (notifDocs.length > 0) {
        await UserNotification.insertMany(notifDocs);
      }
    }
  } catch (err) {
    console.error('Warranty notification cron error:', err.message);
  }
};

const createLicenseExpiryNotifications = async () => {
  try {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const today = new Date();

    const expiringLicenses = await License.find({
      is_deleted: { $ne: true },
      expiry_date: { $gte: today, $lte: thirtyDaysFromNow },
    }).populate('organization');

    for (const license of expiringLicenses) {
      const notification = await Notification.create({
        notification_title: 'License Expiring Soon',
        notification_text: `License "${license.name}" expires on ${license.expiry_date.toDateString()}.`,
        notification_type: 'inapp',
        object_id: license._id.toString(),
        organization: license.organization,
      });

      const admins = await User.find({
        organization: license.organization,
        is_deleted: { $ne: true },
        is_active: true,
        access_level: { $in: ['superuser', 'admin'] },
      });

      const notifDocs = admins.map((admin) => ({
        user: admin._id,
        notification: notification._id,
      }));
      if (notifDocs.length > 0) {
        await UserNotification.insertMany(notifDocs);
      }
    }
  } catch (err) {
    console.error('License expiry notification cron error:', err.message);
  }
};

export const initCronJobs = () => {
  // Daily at midnight: check warranty expiry
  cron.schedule('0 0 * * *', () => {
    console.log('Running warranty expiry check...');
    createWarrantyNotifications();
  });

  // Daily at midnight: check license expiry
  cron.schedule('0 0 * * *', () => {
    console.log('Running license expiry check...');
    createLicenseExpiryNotifications();
  });

  console.log('Cron jobs initialized.');
};
