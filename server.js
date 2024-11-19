process.on('uncaughtException', (err) => {
  console.log('Uncaught Exception! Shutting down the server...');
  console.log(err);

  process.exit(1);
});

const dotenv = require('dotenv');

dotenv.config({ path: `${__dirname}/.env` });

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`Server started: http://127.0.0.1:${port}/`);
});

process.on('unhandledRejection', (err) => {
  console.log('Unhandled Rejection! Shutting down the server...');
  console.log(err);

  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM Recieved! Shutting down gracefully...');

  server.close(() => {
    console.log('Process Terminated!');
  });
});
