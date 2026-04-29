export const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }
    if (!roles.includes(req.user.access_level)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role(s): ${roles.join(', ')}`,
      });
    }
    next();
  };
};

export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const userPermissions = req.user.role?.permissions || [];
    const isSuperuserOrAdmin = ['superuser', 'admin'].includes(req.user.access_level);

    if (isSuperuserOrAdmin || userPermissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Required permission: ${permission}`,
    });
  };
};
