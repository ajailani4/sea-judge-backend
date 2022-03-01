const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db-config');
const { generateJwt } = require('../util/jwt-util');

const saltRounds = 10;

const register = async (request, h) => {
  const {
    name,
    username,
    password,
    state,
    job,
    phoneNumber,
  } = request.payload;
  let result = '';
  let response = '';

  try {
    // Check if username already exists or not
    result = await pool.query(
      'SELECT * FROM public."user" WHERE username=$1',
      [username],
    );

    if (result.rows[0]) {
      response = h.response({
        code: 409,
        status: 'Conflict',
        message: 'Username already exists. Try another username',
      });

      response.code(409);
    } else {
      // Hash user password
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      result = await pool.query(
        'INSERT INTO public."user" (username, password, name, state, job, phone_number) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [username, hashedPassword, name, state, job, phoneNumber],
      );

      response = h.response({
        code: 201,
        status: 'Created',
        data: {
          username: result.rows[0].username,
          accessToken: generateJwt(jwt, username),
        },
      });

      response.code(201);
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

module.exports = { register };
