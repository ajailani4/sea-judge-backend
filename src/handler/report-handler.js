const pool = require('../config/db-config');

const getReports = async (request, h) => {
  const { searchQuery } = request.query;
  let response = '';
  let result = '';

  try {
    if (!searchQuery) {
      // Get all reports
    } else {
      // Get searched reports
      result = await pool.query(
        `SELECT * FROM public."report" WHERE username ILIKE '%${searchQuery}%' OR reporter ILIKE '%${searchQuery}%' OR violation ILIKE '%${searchQuery}%' OR location ILIKE '%${searchQuery}%'`,
      );

      response = h.response({
        code: 200,
        status: 'OK',
        data: result.rows.map((report) => ({
          id: report.id,
          username: report.username,
          reporter: report.reporter,
          image: report.image,
          violation: report.violation,
          location: report.location,
          date: report.date.toISOString().split('T')[0],
          time: report.time.substring(0, 5),
        })),
      });

      response.code(200);
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);

    console.log(err);
  }

  return response;
};

module.exports = { getReports };
