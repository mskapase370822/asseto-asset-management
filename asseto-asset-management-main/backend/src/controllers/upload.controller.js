import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import Asset from '../models/Asset.js';
import User from '../models/User.js';
import { sendPasswordResetEmail } from '../services/email.service.js';

const getOrgId = (req) => req.user.organization?._id || req.user.organization;

const parseCSV = (filePath) => {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter((l) => l.trim());
  if (lines.length < 2) return [];

  const parseRow = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const headers = parseRow(lines[0]);
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseRow(lines[i]);
    const row = {};
    headers.forEach((h, idx) => { row[h] = values[idx] || ''; });
    rows.push(row);
  }

  return rows;
};

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }
    return res.json({ success: true, data: { path: req.file.path, filename: req.file.filename } });
  } catch (err) {
    next(err);
  }
};

export const importAssetsCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const orgId = getOrgId(req);
    const uploadedFilePath = req.file.path;
    const rows = parseCSV(uploadedFilePath);

    const results = { created: 0, failed: 0, errors: [] };

    for (const row of rows) {
      try {
        await Asset.create({
          tag: row.tag,
          name: row.name,
          serial_no: row.serial_no,
          price: row.price ? parseFloat(row.price) : undefined,
          status: row.status || 'Available',
          purchase_date: row.purchase_date ? new Date(row.purchase_date) : undefined,
          description: row.description,
          organization: orgId,
        });
        results.created++;
      } catch (e) {
        results.failed++;
        results.errors.push({ row, error: e.message });
      }
    }

    fs.unlinkSync(uploadedFilePath);
    return res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};

export const importUsersCSV = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No CSV file uploaded' });
    }

    const orgId = getOrgId(req);
    const uploadedFilePath = req.file.path;
    const rows = parseCSV(uploadedFilePath);

    const results = { created: 0, failed: 0, errors: [] };

    for (const row of rows) {
      try {
        const exists = await User.findOne({ email: row.email });
        if (exists) {
          results.failed++;
          results.errors.push({ row, error: 'Email already exists' });
          continue;
        }

        const tempPassword = row.password || crypto.randomBytes(12).toString('hex');

        await User.create({
          email: row.email,
          full_name: row.full_name,
          username: row.username,
          phone: row.phone,
          employee_id: row.employee_id,
          password: tempPassword,
          organization: orgId,
        });

        // Send password reset email so user can set their own password
        const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${tempPassword}`;
        sendPasswordResetEmail(row.email, resetUrl).catch(() => {});

        results.created++;
      } catch (e) {
        results.failed++;
        results.errors.push({ row, error: e.message });
      }
    }

    fs.unlinkSync(uploadedFilePath);
    return res.json({ success: true, data: results });
  } catch (err) {
    next(err);
  }
};
