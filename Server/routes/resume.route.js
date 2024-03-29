import express from "express";
const router = express.Router();
import request from "request";
const template = require("../views/resume.pug");
const templatePrint = require("../views/resumePrint.pug");
import logger from "../logger";
import React from "react";
import ReactDOMServer from "react-dom/server";
import StyleContext from "isomorphic-style-loader/StyleContext";

// import Resume from "../../Client/pages/resume-v2/partials/Resume";
import ResumePrint from "../../Client/pages/resume/ResumePrint";
import puppeteer from "puppeteer";
import System from "../constants/System";
import { getResources } from "../helpers/index";
import { dateToStringFormatCultureVi } from "../../Client/utils/date-utils";

router.get("/view/:userId?", (req, res) => {
  const resources = getResources("resume");
  res.send(
    template({
      title: `Resume`,
      initPrint: false,
      ...resources,
    })
  );
});

router.get("/print/:username?", (req, res) => {
  const { username } = req.params;
  let options = {
    url: `${System.API}/Portfolio/ForHomePage`,
    method: "GET",
  };
  if (username) {
    options = {
      qs: {
        Username: username,
      },
      ...options,
    };
  }
  request(options, function (err, _res, body) {
    body = JSON.parse(body || "{}");
    const css = new Set(); // CSS for all rendered React components
    const insertCss = (...styles) =>
      styles.forEach((style) => css.add(style._getCss()));
    const markup = ReactDOMServer.renderToString(
      <StyleContext.Provider value={{ insertCss }}>
        <ResumePrint
          resume={
            (body && body.result && body.result.length && body.result[0]) || {}
          }
        />
      </StyleContext.Provider>
    );
    const resources = getResources("resume");

    res.send(
      templatePrint({
        body: markup,
        styles: [...css].join("") + "html, body { height: unset !important;}",
        title: `Resume`,
        ...resources,
      })
    );
  });
});

async function printPDF(uri) {
  try {
    const browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless: true,
      executablePath: process.env.CHROME_BIN || null,
      args: [
        "--no-sandbox",
        "--headless",
        "--disable-gpu",
        "--disable-dev-shm-usage",
        "--allow-running-insecure-content",
      ],
    });
    const page = await browser.newPage();
    await page.goto(uri, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { left: "1.5cm", top: "1.5cm", right: "1.5cm", bottom: "1.5cm" },
    });
    await browser.close();
    return pdf;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

function getUsernameFromPrintUrl(url) {
  if (!url) return "";
  const temp = url.split("print")[1];
  return temp.substring(1);
}

router.post("/getprint", (req, res) => {
  const url = req.body.url;
  const uri = `http://0.0.0.0:8080${url}`;
  const username = getUsernameFromPrintUrl(url);
  const filename = `${
    username ? username + "-" : ""
  }resume-${dateToStringFormatCultureVi(new Date())}.pdf`;
  printPDF(uri)
    .then((pdf) => {
      res.set({
        "Content-Type": "application/pdf",
        "Content-Length": pdf.length,
        "Content-Disposition": `attachment; filename="${filename}"`,
      });
      res.send(pdf);
    })
    .catch((error) => {
      logger.error("print resume was failed:" + JSON.stringify(error));
      console.error("print resume was failed:" + JSON.stringify(error));
      res.send(error);
    });
});

export default router;
