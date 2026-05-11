const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const path = require('path');
const config = require('./config');
const db = require('./models/db');
const routes = require('./routes');
const { securityLog, generateSecretKey, hashPassword } = require('./utils/security');
const { homePage } = require('./views/htmlPages');

const app = express();
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(morgan('short'));

// احراز هویت اولیه ابرکاربر
const superAdmin = db.prepare('SELECT * FROM users WHERE role=?').get('super_admin');
if (!superAdmin) {
  const hashed = hashPassword(config.superAdmin.password);
  const info = db.prepare('INSERT INTO users (username, email, password, role) VALUES (?,?,?,?)').run(config.superAdmin.username, 'admin@tetra.local', hashed, 'super_admin');
  db.prepare('INSERT INTO wallets (userId, balance, tetraTokens) VALUES (?, 1000000, 500000)').run(info.lastInsertRowid);
  securityLog(`Super Admin initialized: ${config.superAdmin.username}`);
}

// مسیرها
app.use('/', routes);

// صفحات HTML ایستا
app.get('/', (req, res) => res.send(homePage()));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, '..', 'src', 'views', 'login.html') || ''));
app.get('/register', (req, res) => res.sendFile(path.join(__dirname, '..', 'src', 'views', 'register.html') || ''));
app.get('/wallet', (req, res) => res.sendFile(path.join(__dirname, '..', 'src', 'views', 'wallet.html') || ''));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, '..', 'src', 'views', 'admin.html') || ''));

const PORT = config.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  securityLog(`System started on port ${PORT}`);
});
