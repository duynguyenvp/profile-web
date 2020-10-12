import express from "express";
const router = express.Router();
const template = require("../views/index.pug");

import React from "react";
import ReactDOMServer from "react-dom/server";
import HomePage from "../components/Home";
import StyleContext from "isomorphic-style-loader/StyleContext";
import { getResources } from "../helpers/index";

router.get("/", (req, res) => {
  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));
  const markup = ReactDOMServer.renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <HomePage />
    </StyleContext.Provider>
  );
  const resources = getResources("home");
  res.send(
    template({
      message: markup,
      styles: [...css].join(""),
      title: `Trang chủ`,
      ...resources,
    })
  );
});

router.get("/home", (req, res) => {
  const css = new Set(); // CSS for all rendered React components
  const insertCss = (...styles) =>
    styles.forEach((style) => css.add(style._getCss()));
  const markup = ReactDOMServer.renderToString(
    <StyleContext.Provider value={{ insertCss }}>
      <HomePage />
    </StyleContext.Provider>
  );
  const resources = getResources("home");
  res.send(
    template({
      message: markup,
      styles: [...css].join(""),
      title: `Trang chủ`,
      ...resources,
    })
  );
});

export default router;
