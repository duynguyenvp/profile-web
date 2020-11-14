import React, { useEffect, useState } from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import s from "./index.scss";
import withClickOutside from "../reacthook-withClickOutside";

import getApiInstance from "../../ajax/generic-api";
import BoxUserMenu from "./boxUser";
import { resetState, useUserService } from "../../services/userService";

const Menu = ({ routeDerection, active }) => {
  useStyles(s);
  const [isOpen, setIsOpen] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const user = useUserService();

  const ref = withClickOutside({
    handler: () => {
      setIsOpen(false);
    }
  });

  useEffect(() => {
    setIsReady(true);
    const x = window.matchMedia("(max-width: 900px)");
    matchMedia(x);
    x.addListener(matchMedia);
  }, []);

  const matchMedia = event => {
    if (event.matches) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };

  const menuClick = data => {
    routeDerection(data);
  };

  const sigout = () => {
    getApiInstance("/account")
      .signout()
      .then(res => {
        if (res.successful) {
          resetState();
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  return (
    <nav className="topnav" id="topnav" ref={ref}>
      <div className="nav-container">
        <div id="nav-toggle" className={isOpen ? "active" : ""}>
          <div
            className="btn-menu-toggle"
            onClick={() => {
              setIsOpen(state => !state);
            }}
          >
            <span />
          </div>
          {isMobile && (
            <BoxUserMenu user={user} isReady={isReady} sigout={sigout} />
          )}
        </div>
        <div
          className={`nav-items ${isReady ? "ready" : ""} ${
            isMobile ? "mobile" : ""
          } ${isOpen ? "active" : ""}`}
        >
          <a
            href="/#home"
            className={active === "home" ? "active" : ""}
            onClick={() => {
              menuClick({
                id: "firstZoneId",
                active: "home",
                route: "home"
              });
            }}
          >
            <span>Trang chủ</span>
          </a>
          <a
            href="/#about"
            className={active === "about" ? "active" : ""}
            onClick={() => {
              menuClick({
                id: "secondZoneId",
                active: "about",
                route: "home"
              });
            }}
          >
            <span>Giới thiệu</span>
          </a>
          <a
            href="/#contact"
            className={active === "contact" ? "active" : ""}
            onClick={() => {
              menuClick({
                id: "thirdZoneId",
                active: "contact",
                route: "home"
              });
            }}
          >
            <span>Liên hệ</span>
          </a>
          <a
            href={`/resume/view/${(user.username && user.username) || ""}`}
            className={active === "resume" ? "active" : ""}
            onClick={() => {
              menuClick({
                id: "resume",
                active: "resume",
                route: `/resume/view/${(user.username && user.username) || ""}`
              });
            }}
          >
            <span>Resume</span>
          </a>
          <a
            href={`/bai-viet/${(user.username && `${user.username}/`) || ""}`}
            className={active === "blog" ? "active" : ""}
            onClick={() => {
              menuClick({
                id: "blog",
                active: "blog",
                route: `/bai-viet/${
                  (user.username && `${user.username}/`) || ""
                }`
              });
            }}
          >
            <span>Blog</span>
          </a>
          {!isMobile && (
            <BoxUserMenu user={user} isReady={isReady} sigout={sigout} />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Menu;
