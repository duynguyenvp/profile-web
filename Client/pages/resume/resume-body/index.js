import React, { Component, Fragment } from "react";
import withStyles from "isomorphic-style-loader/withStyles";
import s from "./style.scss";

import StaticProcessBar from "../../../components/static-process-bar";
import SkypeIcon from "../../../assets/ic_skype";

import { getState } from "../../../services/userService";

import {
  dateToStringFormatNoDayCultureVi,
  dateToStringFormatCultureVi
} from "../../../utils/date-utils";
import getApiInstance from "../../../ajax/generic-api";
import PrintDisabled from "../../../assets/ic_print_disabled";

class ResumeBody extends Component {
  state = {
    isPrinting: false,
    isComplete: false
  };

  Print = () => {
    if (this.state.isPrinting) return;
    const user = getState();
    this.setState({ isPrinting: true, isComplete: false });
    getApiInstance("/resume/getprint")
      .getPrint(
        {
          url: `/resume/print/${user.username || ""}`
        },
        {
          responseType: "arraybuffer",
          headers: {
            Accept: "application/pdf"
          },
          timeout: 15 * 1000
        }
      )
      .then(res => {
        const blob = new Blob([res], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = `${
          user.username ? `${user.username}-` : ""
        }resume-${dateToStringFormatCultureVi(new Date())}.pdf`;
        link.click();
        setTimeout(() => {
          this.setState({ isPrinting: false, isComplete: true });
        }, 300);
      })
      .catch(err => {
        console.error(err);
        this.setState({ isPrinting: false });
      });
  };

  renderComplete = () => {
    const { isComplete, isPrinting } = this.state;
    const { isPrint } = this.props;
    if (isPrint) return null;
    if (isComplete) {
      return <h6 className="control-mesage">Tải xuống resume thành công!</h6>;
    }
    return (
      isPrinting && (
        <h6 className="control-mesage">
          Đang chuẩn bị file pdf, vui lòng chờ ...
        </h6>
      )
    );
  };

  renderUserInfo = (portfolioUser) => {
    const { portfolioSkills: skills, isPrint } = this.props;
    const { fullName, jobTitle, email, mobile, skype, address, avatar } =
      portfolioUser || {};
    const avatarStyle = {
      backgroundImage: `url("${avatar || "/dist/images/avatar.jpg"}")`
    };
    const bindValue = value => value || "Chưa có thông tin";
    return (
      <div className={`card ${isPrint ? "print" : ""}`}>
        <div className="card-avatar">
          <div className="avatar" style={avatarStyle} />
        </div>
        <div className="container">
          <h2>{bindValue(fullName)}</h2>
          <p className="card-field-info">
            <i className="material-icons">work</i> {bindValue(jobTitle)}
          </p>
          <p className="card-field-info">
            <i className="material-icons">email</i> {bindValue(email)}
          </p>
          <p className="card-field-info">
            <i className="material-icons">call</i> {bindValue(mobile)}
          </p>
          <p className="card-field-info">
            <SkypeIcon /> {bindValue(skype)}
          </p>
          <p className="card-field-info">
            <i className="material-icons">home</i> {bindValue(address)}
          </p>
          <hr />
          <p className="card-field-info field-title">
            <i className="material-icons">ac_unit</i> SKILLS
          </p>
          <div className="skills-box">
            {skills &&
              skills.map((skill, index) =>
                (isPrint ? (
                  <div className="skill-for-print" key={index}>
                    {skill.skillName}
                  </div>
                ) : (
                  <StaticProcessBar
                    name={skill.skillName}
                    value={skill.level}
                  />
                )))}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const {
      portfolioUser,
      portfolioExperiences: experiences,
      portfolioEducations: educations,
      isPrint
    } = this.props;
    const { isPrinting } = this.state;
    return (
      <div className={`resume-body ${isPrint ? "print" : ""}`}>
        {!portfolioUser && !experiences && !educations ? (
          <Fragment>
            <h1>Bạn chưa được tạo resume.</h1>
            <a href="/quan-tri" className="btn-add-new">
              Tạo resume ở đây
            </a>
          </Fragment>
        ) : (
          <Fragment>
            <div className="box-controls">
              {this.renderComplete()}
              <button
                className={`btn-control-item ${isPrinting ? "disabled" : ""}`}
                onClick={this.Print}
              >
                {isPrinting ? (
                  <PrintDisabled />
                ) : (
                  <i className="material-icons">print</i>
                )}
                {isPrinting ? (
                  <Fragment>
                    <span />
                    <span />
                    <span />
                    <span />
                  </Fragment>
                ) : null}
              </button>
            </div>
            <div className="secondZoneContent">
              {!isPrint && (
                <div className="secondZoneLeftPanel">
                  {this.renderUserInfo(portfolioUser)}
                </div>
              )}
              <div className="secondZoneRightPanel">
                {isPrint && this.renderUserInfo(portfolioUser)}
                <div className="card">
                  <div className="container">
                    <h2 className="card-field-info container-title">
                      <i className="material-icons">assignment</i>{" "}
                      EXPERIENCES
                    </h2>
                    {experiences &&
                      experiences
                        .sort((a, b) => {
                          if ((a.ordinalNumber || 0) < (b.ordinalNumber || 0)) { return -1; }
                          if ((a.ordinalNumber || 0) > (b.ordinalNumber || 0)) { return 1; }
                          return 0;
                        })
                        .map((item, index) => (
                          <div className="content" key={index}>
                            <h5 className="w3-opacity">
                              <b>
                                {item.position} /{item.company}
                              </b>
                            </h5>
                            <h6 className="w3-text-teal">
                              <i className="material-icons">date_range</i>
                              {dateToStringFormatNoDayCultureVi(
                                item.startDate
                              )}{" "}
                              - {dateToStringFormatNoDayCultureVi(item.endDate)}
                            </h6>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item.detail
                              }}
                            />
                            {experiences.length - 1 !== index && <hr />}
                          </div>
                        ))}
                  </div>
                </div>
                <div className="card">
                  <div className="container">
                    <h2 className="card-field-info container-title">
                      <i className="material-icons">school</i>{" "}
                      EDUCATIONS
                    </h2>
                    {educations &&
                      educations.map((education, index) => (
                        <div className="content" key={index}>
                          <h5 className="w3-opacity">
                            <b>{education.schoolName}</b>
                            <b className="PeriodTime">
                              {dateToStringFormatNoDayCultureVi(
                                education.startDate
                              )}{" "}
                              -{" "}
                              {dateToStringFormatNoDayCultureVi(
                                education.endDate
                              )}
                            </b>
                          </h5>
                          <p>{education.specialized}</p>
                          {educations.length - 1 !== index && <hr />}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        )}
        {/* {this.renderComplete()} */}
      </div>
    );
  }
}

export default withStyles(s)(ResumeBody);
