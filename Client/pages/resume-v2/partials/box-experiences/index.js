import React, { Component, Fragment, useMemo } from "react";
import style from "./style.scss";
import useStyles from "isomorphic-style-loader/useStyles";
import { dateToStringFormatNoDayCultureVi } from "../../../../utils/date-utils";
import getLanguage from "../../languages";

const BoxExperiences = ({ portfolioExperiences }) => {
  useStyles(style);
  const language = useMemo(getLanguage, []);
  return (
    <div className="boxExperience">
      <div className="boxExperience__container">
        <h2 className="boxExperience__container__field boxExperience__container__field--title">
          <i className="material-icons">assignment</i>{" "}
          {language.sectionExperiences}
        </h2>
        {portfolioExperiences &&
          portfolioExperiences.map((item, index) => {
            return (
              <div className="boxExperience__container__content" key={index}>
                <h5 className="boxExperience__container__content__name">
                  <b>
                    {item.position} / {item.company}
                  </b>
                </h5>
                <h6 className="boxExperience__container__content__desc">
                  <i className="material-icons">date_range</i>
                  {dateToStringFormatNoDayCultureVi(item.startDate)} -{" "}
                  {dateToStringFormatNoDayCultureVi(item.endDate)}
                </h6>
                <p
                  dangerouslySetInnerHTML={{
                    __html: item.detail,
                  }}
                ></p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BoxExperiences;
