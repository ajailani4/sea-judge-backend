const Hapi = require('@hapi/hapi');
const dotenv = require('dotenv');
const routes = require('./routes');

const init = async () => {
  dotenv.config();

  const server = Hapi.server({
    port: process.env.PORT || 80,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // Setup routes
  server.route(routes);

  // Start server
  await server.start();
  console.log(`Server is running on ${server.info.uri}`);
};

init();
