import React, { useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";
import getLanguage from "../../languages";
import SkypeIcon from "../../../../common-resources/ic_skype";
import StaticProcessBar from "../../../../common/static-process-bar";
const BoxInfomation = ({ portfolioSkills, portfolioUser }) => {
  useStyles(style);
  const language = useMemo(getLanguage, []);
  const { fullName, jobTitle, email, mobile, skype, address, avatar } =
    portfolioUser || {};
  let avatarStyle = {
    backgroundImage: `url("${avatar || "/dist/images/avatar.jpg"}")`,
  };
  const bindValue = (value) => {
    return value || "Chưa có thông tin";
  };
  return (
    <div className={`boxInfo`}>
      <div className="boxInfo__avatar">
        <div className="boxInfo__avatar__image" style={avatarStyle} />
      </div>
      <div className="boxInfo__container">
        <h2>{bindValue(fullName)}</h2>
        <p className="boxInfo__container__field">
          <i className="material-icons">work</i> {bindValue(jobTitle)}
        </p>
        <p className="boxInfo__container__field">
          <i className="material-icons">email</i> {bindValue(email)}
        </p>
        <p className="boxInfo__container__field">
          <i className="material-icons">call</i> {bindValue(mobile)}
        </p>
        <p className="boxInfo__container__field">
          <SkypeIcon /> {bindValue(skype)}
        </p>
        <p className="boxInfo__container__field">
          <i className="material-icons">home</i> {bindValue(address)}
        </p>
        <hr />
        <p className="boxInfo__container__field boxInfo__container__field--title">
          <i className="material-icons">ac_unit</i> {language.sectionSkills}
        </p>
        <div className="boxInfo__container__skills">
          {portfolioSkills &&
            portfolioSkills.map((skill, index) => {
              return (
                <StaticProcessBar
                  key={index}
                  name={skill.skillName}
                  className="skillItem"
                  value={skill.level}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BoxInfomation;
