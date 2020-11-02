import React from "react";
import style from "./style.scss";
import useStyles from "isomorphic-style-loader/useStyles";
import Skeleton from 'react-loading-skeleton';

const mockArray = (length) => {
  let array = [];
  for (let index = 0; index < length; index++) {
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
          experiences.map((item, index) => {
            return (
              <div className="content" key={index}>
                <Skeleton />
                <Skeleton />
                <Skeleton count={5} />
                {experiences.length - 1 != index && <hr />}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default BoxExperienceSkeleton;
