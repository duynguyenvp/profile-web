import express from "express";
const router = express.Router();
import request from "request";
import System from "../constants/System";
const template = require("../views/admin.pug");

import { apiRequireAuth } from "../middlewares/auth.middleware";
import { adminRequireAuth } from "../middlewares/admin.auth.middleware";
import { getResources } from "../helpers/index";

router.get("/*", adminRequireAuth, (req, res) => {
  const resources = getResources("admin");

  res.send(
    template({
      title: `Admin Page`,
      ...resources,
    })
  );
});

router.get("/userInfo", apiRequireAuth, (req, res) => {
  let headers = res.locals.token;
  const options = {
    url: `${System.API}/User/UserInfo`,
    method: "GET",
    headers,
  };

  request(options, function (err, _res, body) {
    res.send(body);
  });
});

export default router;
