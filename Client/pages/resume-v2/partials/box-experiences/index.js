import React from "react";
import PropTypes from "prop-types";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";
import { dateToStringFormatNoDayCultureVi } from "../../../../utils/date-utils";

const BoxExperiences = ({ portfolioExperiences }) => {
  useStyles(style);
  return (
    <div className="boxExperience">
      <div className="boxExperience__container">
        <h2 className="boxExperience__container__field boxExperience__container__field--title">
          <i className="material-icons">assignment</i>{" "}
          EXPERIENCES
        </h2>
        {portfolioExperiences &&
          portfolioExperiences
            .sort((a, b) => {
              if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
              if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
              return 0;
            })
            .map((item, index) => (
              <div className="boxExperience__container__content" key={index}>
                <h5 className="boxExperience__container__content__name">
                  <b>
                    {item.position} /{item.company}
                  </b>
                </h5>
                <h6 className="boxExperience__container__content__desc">
                  <i className="material-icons">date_range</i>
                  {dateToStringFormatNoDayCultureVi(item.startDate)} -{" "}
                  {dateToStringFormatNoDayCultureVi(item.endDate)}
                </h6>
                <p
                  dangerouslySetInnerHTML={{
                    __html: item.detail
                  }}
                />
              </div>
            ))}
      </div>
    </div>
  );
};

BoxExperiences.prototype = {
  portfolioExperiences: PropTypes.array
};

BoxExperiences.defaultProps = {
  portfolioExperiences: []
};

export default BoxExperiences;
