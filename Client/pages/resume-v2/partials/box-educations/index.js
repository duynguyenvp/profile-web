import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";
import { dateToStringFormatNoDayCultureVi } from "../../../../utils/date-utils";

const BoxEducations = ({ portfolioEducations }) => {
  useStyles(style);
  return (
    <div className="boxEducation">
      <div className="boxEducation__container">
        <h2 className="boxEducation__container__field boxEducation__container__field--title">
          <i className="material-icons">assignment</i>{" "}
          EDUCATIONS
        </h2>
        {portfolioEducations &&
          portfolioEducations
            .sort((a, b) => {
              if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
              if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
              return 0;
            })
            .map((education, index) => (
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
            ))}
      </div>
    </div>
  );
};

export default BoxEducations;
