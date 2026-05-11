require('dotenv').config();
module.exports = {
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'fallback_secret',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  dbPath: process.env.DB_PATH || './data/tetra.db',
  superAdmin: {
    username: 'TetraMaster',
    password: 'MasterTetra2024!'
  }
};
