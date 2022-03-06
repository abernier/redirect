import tap from "tap";
import request from "request";
import express from "express";

import redirect from "../index.js";

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

tap.test("next-url", function (t) {
  app.get("/app-next-url1", function (req, res, next) {
    console.log("/app-next-url1");

    res.redirect("/shouldnotgothere");
  });
  app.get("/app-next-url2", function (req, res, next) {
    console.log("/app-next-url2");

    res.status(200).end("next-url2!");
  });

  request(
    {
      method: "GET",
      uri: `http://localhost:${port}/app-next-url1?next=/app-next-url2`,
    },
    function (er, resp, data) {
      t.error(er, "response should not be an error", er);

      t.ok(200 === resp.statusCode, "/app-next-url2 returns a 200");
      t.ok("next-url2!" === data, "/app-next-url2 returns the expected value");

      t.end();
    }
  );
});

tap.test("next-status", function (t) {
  app.get("/app-next-status1", function (req, res, next) {
    console.log("/app-next-status1");

    res.redirect(301, "/shouldnotgothere");
  });

  request(
    {
      method: "GET",
      uri: `http://localhost:${port}/app-next-status1?next=/toto`,
      followRedirect: false,
    },
    function (er, resp, data) {
      t.error(er, "response should not be an error", er);

      t.ok(
        301 === resp.statusCode,
        "/app-next-status1 returns a custom status code"
      );
      t.ok("/toto" === resp.headers.location, "redirect Location is ok");

      t.end();
    }
  );
});

//

tap.test("teardown", function (t) {
  server.close(function (er) {
    console.log("server stopped callback");
    if (er) return t.threw(er);

    t.end();
    tap.end();
  });
});
