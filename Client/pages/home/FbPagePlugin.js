import React, { useLayoutEffect, useState } from "react";
import loadScript from "../../utils/loadScript";

const FbPlugin = () => {
  useLayoutEffect(() => {
    loadScript(
      "https://connect.facebook.net/en_US/sdk.js",
      () => {
        window.fbAsyncInit = function () {
          FB.init({
            appId: "1052049204910473",
            autoLogAppEvents: true,
            xfbml: true,
            version: "v8.0",
          });
        };
      },
      "FB"
    );
  }, []);
  return (
    <div id="fb-root">
      <div
        className="fb-page"
        data-href="https://www.facebook.com/somethingaboutme.info/"
        data-lazy="true"
        data-tabs=""
        data-width=""
        data-height=""
        data-small-header="false"
        data-adapt-container-width="true"
        data-hide-cover="false"
        data-show-facepile="true"
      >
        <blockquote
          cite="https://www.facebook.com/somethingaboutme.info/"
          className="fb-xfbml-parse-ignore"
        >
          <a href="https://www.facebook.com/somethingaboutme.info/">
            Something about me, something about you
          </a>
        </blockquote>
      </div>
    </div>
  );
};

export default FbPlugin;