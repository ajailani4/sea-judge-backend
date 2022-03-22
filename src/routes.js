const { register, login } = require('./handler/user-handler');
const {
  getReports, getUserReports, uploadReport, updateReport, deleteReport,
} = require('./handler/report-handler');

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
  // Get Reports by Username
  {
    method: 'GET',
    path: `${prefix}/users/{username}/reports`,
    config: { auth: 'jwt' },
    handler: getUserReports,
  },
  // Upload Report
  {
    method: 'POST',
    path: `${prefix}/reports`,
    config: {
      auth: 'jwt',
      payload: {
        multipart: true,
      },
    },
    handler: uploadReport,
  },
  // Update Report
  {
    method: 'PUT',
    path: `${prefix}/reports/{id}`,
    config: {
      auth: 'jwt',
    },
    handler: updateReport,
  },
  // Delete Report
  {
    method: 'DELETE',
    path: `${prefix}/reports/{id}`,
    config: {
      auth: 'jwt',
    },
    handler: deleteReport,
  },
];

module.exports = routes;
