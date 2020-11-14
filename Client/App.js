import React, { useState, useLayoutEffect, useEffect, useMemo } from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import AlertContainer from "./components/alert";

import Menu from "./components/top-menu";
import s from "./App.scss";

import getApiInstance from "./ajax/generic-api";
import { setState } from "./services/userService";


let SmoothScroll = null;

const menuMeta = [
  { idMenu: "home", idContent: "firstZoneId" },
  { idMenu: "about", idContent: "secondZoneId" },
  { idMenu: "contact", idContent: "fourthZoneId" }
];

const App = ({ children }) => {
  const [active, setActive] = useState(() => "home");
  const [route, setRoute] = useState(() => "");

  useStyles(s);

  const wrapperId = useMemo(() => {
    if (route === "home") return "app";
    if (route === "bai-viet") return "blog__body";
    if (route === "resume") return "resume_body";
    return "app";
  }, [route]);

  const handleScroll = () => {
    const wrapper = document.getElementById(wrapperId);
    const plane = document.getElementById("plane");
    const topnav = document.getElementById("topnav");
    if (
      (wrapper && wrapper.scrollTop > 120) ||
      document.documentElement.scrollTop > 120
    ) {
      topnav.classList.add("fixed");
      plane.style.display = "flex";
    } else {
      topnav.classList.remove("fixed");
      plane.style.display = "none";
    }
    const pageYOffset = (wrapper && wrapper.scrollTop) || 0;
    const firstZoneBg = document.getElementById("firstZoneBg");
    if (firstZoneBg) {
      firstZoneBg.style.opacity = `${1 - pageYOffset / 700}`;
    }
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [route]);
  useEffect(() => {
    import("smoothscroll-polyfill").then(smoothscroll => {
      SmoothScroll = smoothscroll.default;
      if (SmoothScroll) SmoothScroll.polyfill();
    });
    let { pathname } = window.location;
    pathname = pathname.split(/\//);
    let nextRoute = "home";
    let nextActive = "";
    if (
      pathname.indexOf("bai-viet") !== -1 ||
      pathname.indexOf("blog.html") !== -1
    ) {
      nextRoute = "bai-viet";
      nextActive = "blog";
    }
    if (pathname.indexOf("resume") !== -1) {
      nextRoute = "resume";
      nextActive = "resume";
    }
    if (window.location.hash) {
      nextActive = window.location.hash.substr(1);
    }
    setRoute(() => nextRoute);
    setActive(() => nextActive || "home");
  }, []);

  useLayoutEffect(() => {
    routeDerection({ active, route });
  }, [active, route]);

  useEffect(() => {
    getApiInstance()
      .getWithQueryStringAuth({
        url: "/User/UserInfo"
      })
      .then(res => {
        if (res.successful) {
          setState(res.result);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, []);

  const routeDerection = ({ id, active, route: newRoute }) => {
    if (newRoute !== route) {
      if (id === "blog" || id === "resume") {
        window.location = `/${newRoute}`;
        return;
      }
      window.location = `/${newRoute}/#${active}`;
      return;
    }
    let tempID = id;
    if (!tempID) {
      const menu = menuMeta.find(f => f.idMenu === active);
      if (menu) {
        tempID = menu.idContent;
      }
    }
    try {
      const zone = document.getElementById(tempID);
      const app = document.getElementById("app");
      app.scrollTo({
        top: zone ? zone.offsetTop : 0,
        left: 0,
        behavior: "smooth"
      });
    } catch (error) {
      console.error(error);
    }
    setActive(active);
  };

  const gotoTop = () => {
    try {
      const wrapper = document.getElementById(wrapperId);
      wrapper.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Menu active={active} routeDerection={routeDerection} />
      {children}
      <div
        id="plane"
        className="plane"
        style={{ display: "none" }}
        onClick={gotoTop}
      >
        <i className="material-icons">keyboard_arrow_up</i>
      </div>
      <AlertContainer />
    </>
  );
};

export default App;
