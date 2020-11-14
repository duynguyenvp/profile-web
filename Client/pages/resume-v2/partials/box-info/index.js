import React from "react";
import PropTypes from "prop-types";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";
import SkypeIcon from "../../../../assets/ic_skype";
import StaticProcessBar from "../../../../components/static-process-bar";

const BoxInfomation = ({ portfolioSkills, portfolioUser }) => {
  useStyles(style);
  const { fullName, jobTitle, email, mobile, skype, address, avatar } =
    portfolioUser || {};
  const avatarStyle = {
    backgroundImage: `url("${avatar || "/dist/images/avatar.jpg"}")`
  };
  const bindValue = value => value || "Chưa có thông tin";
  return (
    <div className="boxInfo">
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
          <i className="material-icons">ac_unit</i> SKILLS
        </p>
        <div className="boxInfo__container__skills">
          {portfolioSkills &&
            portfolioSkills
              .sort((a, b) => {
                if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) return -1;
                if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) return 1;
                return 0;
              })
              .map((skill, index) => (
                <StaticProcessBar
                  key={index}
                  name={skill.skillName}
                  className="skillItem"
                  value={skill.level}
                />
              ))}
        </div>
      </div>
    </div>
  );
};

BoxInfomation.propTypes = {
  portfolioUser: PropTypes.object,
  portfolioSkills: PropTypes.array
};

BoxInfomation.defaultProps = {
  portfolioUser: {},
  portfolioSkills: []
};

export default BoxInfomation;
