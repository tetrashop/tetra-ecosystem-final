const db = require('../models/db');
const { securityLog } = require('../utils/security');

exports.getWallet = (req, res) => {
  try {
    const wallet = db.prepare('SELECT * FROM wallets WHERE userId=?').get(req.user.id);
    if (!wallet) return res.status(404).json({ error: 'کیف پول یافت نشد' });
    const transactions = db.prepare('SELECT * FROM transactions WHERE fromUserId=? OR toUserId=? ORDER BY timestamp DESC LIMIT 10').all(req.user.id, req.user.id);
    res.json({ success: true, wallet: { balance: wallet.balance, tetraTokens: wallet.tetraTokens, recentTransactions: transactions } });
  } catch (err) {
    securityLog(`Wallet access error: ${err.message}`);
    res.status(500).json({ error: 'خطای سرور' });
  }
};

exports.transfer = (req, res) => {
  try {
    const { toUserId, amount, tokenType } = req.body;
    if (!toUserId || !amount || amount <= 0) return res.status(400).json({ error: 'اطلاعات نامعتبر' });
    const fromWallet = db.prepare('SELECT * FROM wallets WHERE userId=?').get(req.user.id);
    if (!fromWallet) return res.status(404).json({ error: 'کیف پول مبدا یافت نشد' });
    const toWallet = db.prepare('SELECT * FROM wallets WHERE userId=?').get(toUserId);
    if (!toWallet) return res.status(404).json({ error: 'کیف پول مقصد یافت نشد' });
    if (tokenType === 'token') {
      if (fromWallet.tetraTokens < amount) return res.status(400).json({ error: 'موجودی توکن کافی نیست' });
      db.prepare('UPDATE wallets SET tetraTokens = tetraTokens - ? WHERE userId=?').run(amount, req.user.id);
      db.prepare('UPDATE wallets SET tetraTokens = tetraTokens + ? WHERE userId=?').run(amount, toUserId);
    } else {
      if (fromWallet.balance < amount) return res.status(400).json({ error: 'موجودی کافی نیست' });
      db.prepare('UPDATE wallets SET balance = balance - ? WHERE userId=?').run(amount, req.user.id);
      db.prepare('UPDATE wallets SET balance = balance + ? WHERE userId=?').run(amount, toUserId);
    }
    db.prepare('INSERT INTO transactions (fromUserId, toUserId, amount, type) VALUES (?,?,?,?)').run(req.user.id, toUserId, amount, tokenType || 'transfer');
    securityLog(`Transfer: ${req.user.id} -> ${toUserId} | Amount: ${amount} | Token: ${tokenType || 'TETRA'}`);
    res.json({ success: true, message: 'تراکنش با موفقیت انجام شد' });
  } catch (err) {
    securityLog(`Transfer error: ${err.message}`);
    res.status(500).json({ error: 'خطای سرور' });
  }
};
