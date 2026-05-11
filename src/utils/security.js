const crypto = require('crypto');
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [new winston.transports.File({ filename: 'security.log' })]
});

function generateSecretKey() {
  return crypto.randomBytes(64).toString('hex');
}

function hashPassword(password) {
  return require('bcryptjs').hashSync(password, 10);
}

function comparePassword(password, hash) {
  return require('bcryptjs').compareSync(password, hash);
}

function securityLog(message) {
  logger.info(message);
  console.log(`🛡️ ${message}`);
}

module.exports = { generateSecretKey, hashPassword, comparePassword, securityLog };
