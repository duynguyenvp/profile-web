import React, { useLayoutEffect } from "react";
import loadScript from "../../../utils/loadScript";

const fbAppId = "1052049204910473";
const FbShareButton = ({ postUrl }) => {
  useLayoutEffect(() => {
    loadScript(
      "https://connect.facebook.net/en_US/sdk.js",
      () => {
        window.fbAsyncInit = function () {
          window.FB.init({
            appId: fbAppId,
            autoLogAppEvents: true,
            xfbml: true,
            version: "v8.0"
          });
        };
      },
      "FB"
    );
  }, []);
  const urlEncoded = encodeURIComponent(
    `http://somethingaboutme.info${postUrl}`
  );
  const path = `https://www.facebook.com/plugins/share_button.php?href=${urlEncoded}&layout=button&size=small&appId=${fbAppId}&width=76&height=20`;
  return (
    <div id="fb-root">
      <div
        className="fb-share-button"
        data-href={`http://somethingaboutme.info${postUrl}`}
        data-layout="button"
        data-lazy="true"
        data-size="small"
      >
        <a
          target="_blank"
          href={path}
          className="fb-xfbml-parse-ignore"
          rel="noreferrer"
        >
          Chia sẻ
        </a>
      </div>
    </div>
  );
};

export default FbShareButton;
