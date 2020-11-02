import React, { useMemo } from "react";
import style from "./style.scss";
import useStyles from "isomorphic-style-loader/useStyles";
import { dateToStringFormatNoDayCultureVi } from "../../../../utils/date-utils";
import getLanguage from "../../languages";

const BoxEducations = ({ portfolioEducations }) => {
  useStyles(style);
  const language = useMemo(getLanguage, []);
  return (
    <div className="boxEducation">
      <div className="boxEducation__container">
        <h2 className="boxEducation__container__field boxEducation__container__field--title">
          <i className="material-icons">assignment</i>{" "}
          {language.sectionEducations}
        </h2>
        {portfolioEducations &&
          portfolioEducations.map((education, index) => {
            return (
              <div className="boxEducation__container__content" key={index}>
                <h5 className="boxEducation__container__content__name">
                  <b>{education.schoolName}</b>
                  <b className="boxEducation__container__content__name--right">
                    {dateToStringFormatNoDayCultureVi(education.startDate)} -{" "}
                    {dateToStringFormatNoDayCultureVi(education.endDate)}
                  </b>
                </h5>
                <p>{education.specialized}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BoxEducations;
