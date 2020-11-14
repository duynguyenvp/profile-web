import URL from "url-parse";

export const isAbsoluteUrl = (url) => {
  if (!url) return false;
  // eslint-disable-next-line
  return /^(http:\/\/|https:\/\/|\/\/)/g.test(url);
};

export const randomId = () => {
  let text = "";
  const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < 10; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
};

export const isSafeUrl = (dangerousURL) => {
  const url = URL(dangerousURL, {});
  if (url.protocol === "http:") return true;
  if (url.protocol === "https:") return true;
  return false;
};
