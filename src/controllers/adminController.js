const db = require('../models/db');
const { securityLog } = require('../utils/security');

exports.getStats = (req, res) => {
  if (req.user.role !== 'super_admin') return res.status(403).json({ error: 'فقط مدیر ارشد' });
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get().count;
    const totalWallets = db.prepare('SELECT COUNT(*) as count FROM wallets').get().count;
    const activeSessions = db.prepare('SELECT COUNT(*) as count FROM sessions').get().count;
    const totalBalance = db.prepare('SELECT SUM(balance) as sum FROM wallets').get().sum || 0;
    res.json({ success: true, stats: { totalUsers, totalWallets, activeSessions, totalBalance } });
  } catch (err) {
    securityLog(`Admin stats error: ${err.message}`);
    res.status(500).json({ error: 'خطا' });
  }
};

exports.getUsers = (req, res) => {
  if (req.user.role !== 'super_admin') return res.status(403).json({ error: 'فقط مدیر ارشد' });
  try {
    const users = db.prepare('SELECT id, username, email, role, createdAt FROM users').all();
    res.json({ success: true, users });
  } catch (err) {
    securityLog(`Admin users error: ${err.message}`);
    res.status(500).json({ error: 'خطا' });
  }
};
