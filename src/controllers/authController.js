const db = require('../models/db');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { hashPassword, comparePassword, securityLog } = require('../utils/security');

exports.register = (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: 'فیلدها را کامل کنید' });
    const existing = db.prepare('SELECT id FROM users WHERE username=? OR email=?').get(username, email);
    if (existing) return res.status(409).json({ error: 'کاربری با این مشخصات وجود دارد' });
    const hashed = hashPassword(password);
    const info = db.prepare('INSERT INTO users (username, email, password) VALUES (?,?,?)').run(username, email, hashed);
    // ایجاد کیف پول
    db.prepare('INSERT INTO wallets (userId, balance, tetraTokens) VALUES (?, 100, 10)').run(info.lastInsertRowid);
    securityLog(`New user registered: ${username}`);
    res.status(201).json({ success: true, message: 'ثبت‌نام با موفقیت انجام شد' });
  } catch (err) {
    securityLog(`Registration error: ${err.message}`);
    res.status(500).json({ error: 'خطای سرور' });
  }
};

exports.login = (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'نام کاربری و رمز عبور الزامی است' });
    const user = db.prepare('SELECT * FROM users WHERE username=? OR email=?').get(username, username);
    if (!user) {
      securityLog(`Failed login - user not found: ${username}`);
      return res.status(401).json({ error: 'کاربر یافت نشد' });
    }
    if (!comparePassword(password, user.password)) {
      securityLog(`Wrong password for: ${username}`);
      return res.status(401).json({ error: 'رمز عبور اشتباه است' });
    }
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpire });
    db.prepare('INSERT INTO sessions (userId, token) VALUES (?,?)').run(user.id, token);
    securityLog(`Successful login: ${username}`);
    res.json({ success: true, token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (err) {
    securityLog(`Login error: ${err.message}`);
    res.status(500).json({ error: 'خطای سرور' });
  }
};

exports.logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(token);
    securityLog(`User logged out: ${req.user?.username || 'unknown'}`);
    res.json({ success: true, message: 'خروج موفق' });
  } catch (err) {
    res.status(500).json({ error: 'خطا' });
  }
};
