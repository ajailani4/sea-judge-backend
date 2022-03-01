const pool = require('../config/db-config');

const generateJwt = (jwt, _username) => jwt.sign(
  {
    username: _username,
  },
  process.env.JWT_SECRET,
);

module.exports = { generateJwt };
