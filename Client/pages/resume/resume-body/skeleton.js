import React, { Component, Fragment } from "react";

import Skeleton from "react-loading-skeleton";
import withStyles from "isomorphic-style-loader/withStyles";
import s from "./style.scss";

const mockArray = (length) => {
  const array = [];
  for (let index = 0; index < length; index += 1) {
    array.push(index);
  }
  return array;
};
class ResumeBodySkeleton extends Component {
  renderUserInfo = () => {
    const skills = mockArray(6);
    return (
      <div className="card">
        <div className="card-avatar">
          <Skeleton height={250} width={250} />
        </div>
        <div className="container">
          <Skeleton height={26} />
          <p className="card-field-info">
            <Skeleton width={250} />
          </p>
          <p className="card-field-info">
            <Skeleton width={250} />
          </p>
          <p className="card-field-info">
            <Skeleton width={250} />
          </p>
          <p className="card-field-info">
            <Skeleton width={250} />
          </p>
          <p className="card-field-info">
            <Skeleton width={250} />
          </p>
          <hr />
          <p className="card-field-info field-title">
            <Skeleton height={26} width={250} />
          </p>
          <div className="skills-box">
            {skills &&
              skills.map(() => (
                <>
                  <Skeleton width={100} />
                  <Skeleton width={250} />
                </>
              ))}
          </div>
        </div>
      </div>
    );
  };

  render() {
    const experiences = mockArray(3);
    const educations = mockArray(3);
    return (
      <div className="resume-body">
        <Fragment>
          <div className="secondZoneContent">
            <div className="secondZoneLeftPanel">{this.renderUserInfo()}</div>
            <div className="secondZoneRightPanel">
              <div className="card">
                <div className="container">
                  <h2 className="card-field-info container-title">
                    <Skeleton width={250} height={40} />
                  </h2>
                  {experiences &&
                    experiences.map((item, index) => (
                      <div className="content" key={item}>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton count={5} />
                        {experiences.length - 1 !== index && <hr />}
                      </div>
                    ))}
                </div>
              </div>
              <div className="card">
                <div className="container">
                  <h2 className="card-field-info container-title">
                    <Skeleton width={250} height={40} />
                  </h2>
                  {educations &&
                    educations.map((education, index) => (
                      <div className="content" key={education}>
                        <h5 className="w3-opacity">
                          <Skeleton />
                          <Skeleton />
                        </h5>
                        <Skeleton count={5} />
                        {educations.length - 1 !== index && <hr />}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </Fragment>
      </div>
    );
  }
}

export default withStyles(s)(ResumeBodySkeleton);
