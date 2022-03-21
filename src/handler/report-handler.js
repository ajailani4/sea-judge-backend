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
        'SELECT * FROM public."report" ORDER BY id DESC',
      );
    } else {
      // Get searched reports
      result = await pool.query(
        `SELECT * FROM public."report" WHERE username ILIKE '%${searchQuery}%' OR reporter ILIKE '%${searchQuery}%' OR violation ILIKE '%${searchQuery}%' OR location ILIKE '%${searchQuery}%' ORDER BY id DESC`,
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

const getUserReports = async(request, h) => {
  const { username } = request.params;
  let response = '';
  let result = '';

  try {
    // Get all reports by username
    result = await pool.query('SELECT * FROM public."report" WHERE username=$1 ORDER BY id DESC', [username]);

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

    // Upload report
    const result = await pool.query('INSERT INTO public."report" (username, reporter, photo, violation, location, date, time) VALUES ($1, (SELECT name from public."user" WHERE username = $2), $3, $4, $5, $6, $7) RETURNING *', [
      username,
      username,
      photo,
      violation,
      location,
      date,
      time,
    ]);

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

// Update Report
const isReprotExist = async(id) => {
  let isExist = false;

  try {
    const getid = await pool.query(
      `SELECT id FROM public."report" WHERE id=$1`, [id],
    );

    if (getid) {
      isExist = true;
    } else {
      isExist = false;
    }
  } catch (err) {
    console.log(err);
  }
  return isExist;
};

const updateReport = async(request, h) => {
  const { id } = request.params;
  const {
    violation,
    location,
    date,
    time,
  } = request.payload;
  let response = '';

  try {
    if (await isReprotExist(id)) {
      const result = await pool.query(
        `UPDATE public."report" SET violation=$1, location=$2, date=$3, time=$4 WHERE id=$5`, [
          violation,
          location,
          date,
          time,
          id,
        ],
      );

      if (result) {
        response = h.response({
          code: 201,
          status: 'Updated',
          message: 'Report has been updated',
        });

        response.code(201);
      } else {
        response = h.response({
          code: 500,
          status: 'Internal Server Error',
          message: 'Report cannot be edited',
        });

        response.code(500);
      }
    } else {
      response = h.response({
        code: 404,
        status: 'Not Found',
        message: 'Report is not found',
      });
    }
  } catch (err) {
    response = h.response({
      code: 400,
      status: 'Bad Request',
      message: 'error',
    });

    response.code(400);
  }
  return response;
};

module.exports = { getReports, getUserReports, uploadReport, updateReport };