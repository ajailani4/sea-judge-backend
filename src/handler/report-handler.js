const pool = require('../config/db-config');
const { uploadPhoto } = require('../util/cloudinary-util');

const getReports = async(request, h) => {
  const { searchQuery } = request.query;
  let response = '';
  let result = '';

  try {
    if (!searchQuery) {
      // Get all reports
      result = await pool.query(
        'SELECT * FROM public."report"',
      );
    } else {
      // Get searched reports
      result = await pool.query(
        `SELECT * FROM public."report" WHERE username ILIKE '%${searchQuery}%' OR reporter ILIKE '%${searchQuery}%' OR violation ILIKE '%${searchQuery}%' OR location ILIKE '%${searchQuery}%'`,
      );
    }

    response = h.response({
      code: 200,
      status: 'OK',
      data: result.rows.map((report) => ({
        id: report.id,
        username: report.username,
        reporter: report.reporter,
        photo: report.photo,
        violation: report.violation,
        location: report.location,
        date: report.date.toISOString().split('T')[0],
        time: report.time.substring(0, 5),
      })),
    });

    response.code(200);
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

const getReportsUser = async(request, h) => {
  const { username } = request.params;
  let response = '';
  let result = '';

  try {
    // Get all reports by username
    result = await pool.query('SELECT * FROM public."report" WHERE username=$1', [username]);

    response = h.response({
      code: 200,
      status: 'OK',
      data: result.rows.map((report) => ({
        id: report.id,
        username: report.username,
        reporter: report.reporter,
        photo: report.photo,
        violation: report.violation,
        location: report.location,
        date: report.date.toISOString().split('T')[0],
        time: report.time.substring(0, 5),
      })),
    });

    response.code(200);
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

const uploadReport = async(request, h) => {
  const {
    username,
    reporter,
    violation,
    location,
    date,
    time,
  } = request.payload;
  let {
    photo,
  } = request.payload;
  let response = '';

  try {
    const uploadPhotoResult = await uploadPhoto('report_photo', photo);
    photo = uploadPhotoResult.url;

    const result = await pool.query(
      'INSERT INTO public."report" (username, reporter, photo, violation, location, date, time) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', [
        username,
        reporter,
        photo,
        violation,
        location,
        date,
        time,
      ],
    );

    if (result) {
      response = h.response({
        code: 201,
        status: 'Created',
        message: 'New report has been added successfully',
      });

      response.code(201);
    } else {
      response = h.response({
        code: 500,
        status: 'Internal Server Error',
        message: 'New report cannot be added',
      });

      response.code(500);
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

module.exports = { getReports, getReportsUser, uploadReport };