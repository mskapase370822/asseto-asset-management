import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './src/config/db.js';
import { initCronJobs } from './src/services/cron.service.js';
import errorHandler from './src/middleware/errorHandler.js';

import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import assetRoutes from './src/routes/asset.routes.js';
import productRoutes from './src/routes/product.routes.js';
import vendorRoutes from './src/routes/vendor.routes.js';
import auditRoutes from './src/routes/audit.routes.js';
import licenseRoutes from './src/routes/license.routes.js';
import dashboardRoutes from './src/routes/dashboard.routes.js';
import notificationRoutes from './src/routes/notification.routes.js';
import configurationRoutes from './src/routes/configuration.routes.js';
import supportRoutes from './src/routes/support.routes.js';
import searchRoutes from './src/routes/search.routes.js';
import uploadRoutes from './src/routes/upload.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/products', productRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/licenses', licenseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/config', configurationRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  initCronJobs();
});

export default app;
