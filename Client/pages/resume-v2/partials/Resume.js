import React, { Fragment, useEffect, useLayoutEffect, useState } from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "../style.scss";

import { getResumeData, resumePrint } from "../queries";
import BoxInfomation from "./box-info";
import BoxExperiences from "./box-experiences";
import BoxEducations from "./box-educations";
import PrintDisabled from "../../../common-resources/ic_print_disabled";
import { addAlert } from "../../../services/alertService";

const Resume = () => {
  useStyles(style);
  const [state, setState] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let pathname = window.location.pathname;
    pathname = pathname.split(/\//);

    let Username = pathname[pathname.length - 1];
    if (Username && Username != "resume" && Username != "print") {
      setUsername(Username);
    }
  }, []);

  useEffect(() => {
    if (username) {
      loadData(username);
    } else {
      loadData();
    }
  }, [username]);

  const loadData = (Username) => {
    let options = {
      url: "/Portfolio/ForHomePage",
    };
    if (Username) {
      options = {
        ...options,
        data: {
          Username,
        },
      };
    }
    getResumeData(Username)
      .then((res) => {
        setIsLoading(false);
        setState(res);
      })
      .catch((error) => {
        setIsLoading(false);
        console.error(error);
      });
  };
  const print = () => {
    setIsPrinting(true);
    resumePrint(username)
      .then((res) => {
        setIsPrinting(false);
        addAlert({ type: "success", message: "Đã tải xuống file PDF." });
      })
      .catch((eror) => {
        setIsPrinting(false);
      });
  };
  const { portfolioUser, portfolioExperiences, portfolioEducations } = state;
  return (
    <section id="resume" className={`resume`}>
      <button
        className={`btn-control-item ${isPrinting ? "disabled" : ""}`}
        onClick={print}
      >
        {isPrinting ? (
          <PrintDisabled />
        ) : (
          <i className="material-icons">print</i>
        )}
        {isPrinting ? (
          <Fragment>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </Fragment>
        ) : null}
      </button>
      <aside className={`resume__aside resume__aside--width`}>
        <BoxInfomation {...state} />
      </aside>
      <section id="resume__body" className="resume__body">
        <section className="content">
          {!portfolioUser && !portfolioExperiences && !portfolioEducations ? (
            <Fragment>
              <h1>Bạn chưa được tạo resume.</h1>
              <a href="/quan-tri" className="btn-add-new">
                Tạo resume ở đâyy
              </a>
            </Fragment>
          ) : (
            <Fragment>
              <BoxExperiences {...state} />
              <BoxEducations {...state} />
            </Fragment>
          )}
        </section>
      </section>
    </section>
  );
};

export default Resume;
