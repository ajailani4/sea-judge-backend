const { register, login } = require('./handler/user-handler');
<<<<<<< HEAD
const { getReports, getReportsUser, uploadReport, updateReport } = require('./handler/report-handler');
=======
const { getReports, getUserReports, uploadReport } = require('./handler/report-handler');
>>>>>>> 55a9944d2799fd10c32f4032803021403ebc0f23

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
];

module.exports = routes;
