const { register, login } = require('./handler/user-handler');
const { uploadReport } = require('./handler/report-handler');

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
  //Upload Plant
  {
    method: 'POST',
    path: '${prefix}/reports',
    config: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
    },
    handler: uploadReport,
  }
];

module.exports = routes;