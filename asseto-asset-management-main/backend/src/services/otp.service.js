import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateSecret = (username) => {
  const secret = speakeasy.generateSecret({
    name: `Asseto (${username})`,
    length: 20,
  });
  return {
    secret: secret.base32,
    otpauth_url: secret.otpauth_url,
  };
};

export const generateQRCode = async (otpauth_url) => {
  const qrCodeDataUrl = await QRCode.toDataURL(otpauth_url);
  return qrCodeDataUrl;
};

export const verifyToken = (secret, token) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 1,
  });
};
