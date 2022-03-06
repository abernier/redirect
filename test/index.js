const tap = require("tap");
const request = require("request");
const express = require("express");

const redirect = require("../index.js");

let app;
let server;
const port = 3000 + Math.floor(Math.random() * 999);

tap.test("setup", function (t) {
  app = express();

  app.use(redirect());

  server = app.listen(port, function (er) {
    if (er) return t.threw(er);

    t.end();
  });
});

tap.test("url", function (t) {
  app.get("/app-url1", function (req, res, next) {
    // console.log("/app-url1");

    res.redirect("/shouldnotgothere");
  });
  app.get("/app-url2", function (req, res, next) {
    // console.log("/app-url2");

    res.status(200).end("url2!");
  });

  request(
    {
      method: "GET",
      uri: `http://localhost:${port}/app-url1?redirect=/app-url2`,
    },
    function (er, resp, data) {
      t.error(er, "response should not be an error", er);

      t.ok(200 === resp.statusCode, "/app-url2 returns a 200");
      t.ok("url2!" === data, "/app-url2 returns the expected value");

      t.end();
    }
  );
});

tap.test("status", function (t) {
  app.get("/app-status1", function (req, res, next) {
    // console.log("/app-status1");

    res.redirect(301, "/shouldnotgothere");
  });

  request(
    {
      method: "GET",
      uri: `http://localhost:${port}/app-status1?redirect=/toto`,
      followRedirect: false,
    },
    function (er, resp, data) {
      t.error(er, "response should not be an error", er);

      t.ok(
        301 === resp.statusCode,
        "/app-status1 returns a custom status code"
      );
      t.ok("/toto" === resp.headers.location, "redirect Location is ok");

      t.end();
    }
  );
});

//

tap.test("teardown", function (t) {
  server.close(function (er) {
    // console.log("server stopped callback");
    if (er) return t.threw(er);

    t.end();
    tap.end();
  });
});
