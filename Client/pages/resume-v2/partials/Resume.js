import React, { Fragment, useEffect, useState } from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "../style.scss";

import { getResumeData, resumePrint } from "../queries";
import BoxInfomation from "./box-info";
import BoxExperiences from "./box-experiences";
import BoxEducations from "./box-educations";
import IconPrintDisabled from "../../../assets/ic_print_disabled";
import IconPrint from "../../../assets/ic_print";
import { addAlert } from "../../../services/alertService";
import BoxInfomationSkeleton from "./box-info/skeleton";
import BoxExperienceSkeleton from "./box-experiences/skeleton";
import BoxEducationSkeleton from "./box-educations/skeleton";

const Resume = () => {
  useStyles(style);
  const [state, setState] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    let { pathname } = window.location;
    pathname = pathname.split(/\//);

    const Username = pathname[pathname.length - 1];
    if (Username && Username !== "resume" && Username !== "print") {
      setUsername(Username);
    }
    document.title = Username;
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return;
    if (username) {
      loadData(username);
    } else {
      loadData();
    }
  }, [username, isReady]);

  const loadData = Username => {
    getResumeData(Username)
      .then(res => {
        setIsLoading(false);
        setState(res);
      })
      .catch(error => {
        setIsLoading(false);
        console.error(error);
      });
  };
  const print = () => {
    setIsPrinting(true);
    resumePrint(username)
      .then(() => {
        setIsPrinting(false);
        addAlert({ type: "success", message: "Đã tải xuống file PDF." });
      })
      .catch(() => {
        setIsPrinting(false);
      });
  };
  const renderLeftZone = () => {
    if (isLoading) {
      return <BoxInfomationSkeleton />;
    }
    const { portfolioUser, portfolioSkills } = state;
    if (portfolioUser && portfolioSkills) {
      return <BoxInfomation {...state} />;
    }
    return null;
  };
  const renderRightZone = () => {
    const { portfolioUser, portfolioExperiences, portfolioEducations } = state;
    if (isLoading) {
      return (
        <Fragment>
          <BoxExperienceSkeleton />
          <BoxEducationSkeleton />
        </Fragment>
      );
    }
    if (!portfolioUser && !portfolioExperiences && !portfolioEducations) {
      return (
        <Fragment>
          <h1 style={{ textAlign: "center" }}>Bạn chưa được tạo resume.</h1>
          <a href="/quan-tri" className="resume__body__btnAddNew">
            Tạo resume ở đây
          </a>
        </Fragment>
      );
    }
    return (
      <Fragment>
        <BoxExperiences {...state} />
        <BoxEducations {...state} />
      </Fragment>
    );
  };

  return (
    <section id="resume" className="resume">
      <button
        className={`btn-control-item ${isPrinting ? "disabled" : ""}`}
        onClick={print}
      >
        {isPrinting ? <IconPrintDisabled /> : <IconPrint />}
        {isPrinting ? (
          <Fragment>
            <span />
            <span />
            <span />
            <span />
          </Fragment>
        ) : null}
      </button>
      <aside className="resume__aside resume__aside--width">
        {renderLeftZone()}
      </aside>
      <section id="resume__body" className="resume__body">
        <section className="content">{renderRightZone()}</section>
      </section>
    </section>
  );
};

export default Resume;
