import assets from "../assets.json";
import RESOURCE_VERSION from "../../version";

export const getResources = (page) => {
  const result = {
    resource_version: RESOURCE_VERSION,
    css: [],
    scripts: [],
  };
  if (!page) return result;
  const resources = assets.entryPoints[page];
  if (!resources) return result;
  return {
    ...result,
    css:
      (resources.css &&
        resources.css.map((item) => {
          return `/dist/${item}?v=${RESOURCE_VERSION}`;
        })) ||
      [],
    scripts:
      (resources.js &&
        resources.js.map((item) => {
          return `/dist/${item}?v=${RESOURCE_VERSION}`;
        })) ||
      [],
  };
};
