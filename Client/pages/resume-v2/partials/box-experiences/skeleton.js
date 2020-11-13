import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import Skeleton from "react-loading-skeleton";
import style from "./style.scss";

const mockArray = length => {
  const array = [];
  for (let index = 0; index < length; index += 1) {
    array.push(index);
  }
  return array;
};
const BoxExperienceSkeleton = () => {
  useStyles(style);
  const experiences = mockArray(3);
  return (
    <div className="boxExperience">
      <div className="boxExperience__container">
        <h2 className="boxExperience__container__field boxExperience__container__field--title">
          <Skeleton width={250} height={40} />
        </h2>
        {experiences &&
          experiences.map((item, index) => (
            <div className="content" key={index}>
              <Skeleton />
              <Skeleton />
              <Skeleton count={5} />
              {experiences.length - 1 !== index && <hr />}
            </div>
          ))}
      </div>
    </div>
  );
};

export default BoxExperienceSkeleton;
