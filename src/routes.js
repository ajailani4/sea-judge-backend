const { register, login } = require('./handler/user-handler');
const { getReports } = require('./handler/report-handler');

const prefix = '/api/v1';

const routes = [
  // Register
  {
    method: 'POST',
    path: `${prefix}/register`,
    config: { auth: false },
    handler: register,
  },
  // Login
  {
    method: 'POST',
    path: `${prefix}/login`,
    config: { auth: false },
    handler: login,
  },
  // Get Reports (All Reports and Searched Reports)
  {
    method: 'GET',
    path: `${prefix}/reports`,
    config: { auth: 'jwt' },
    handler: getReports,
  },
];

module.exports = routes;
