"use strict";

const TEST_PORT = process.env.TEST_PORT || 3002;
const TEST_HOST = process.env.TEST_HOST || "localhost";

module.exports = {
  port: TEST_PORT,
  host: TEST_HOST,
  server: `${TEST_HOST}:${TEST_PORT}`,
};
