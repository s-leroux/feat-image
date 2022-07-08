"use strict";
/*
 *  Mini webserver for mocha tests
 */

const path = require("path");
const express = require("express");
const config = require("./config.js");
const app = express();
app.use(express.static(path.join(__dirname, "public")));

function startServer(options) {
  return new Promise((resolve, _reject) => {
    const server = app.listen(options, () => resolve(server));
  });
}

function stopServer(server) {
  return new Promise((resolve, _reject) => server.close(resolve));
}

exports.mochaGlobalSetup = async function () {
  this.server = await startServer({port: config.port});
  console.log(`Test server running on port ${this.server.address().port}`);
};

exports.mochaGlobalTeardown = async function () {
  await stopServer(this.server);
  console.log("Test server stopped");
};
