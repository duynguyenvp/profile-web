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
const BoxEducationSkeleton = () => {
  useStyles(style);
  const educations = mockArray(3);
  return (
    <div className="boxEducation">
      <div className="boxEducation__container">
        <h2 className="boxEducation__container__field boxEducation__container__field--title">
          <Skeleton width={250} height={40} />
        </h2>
        {educations &&
          educations.map((education, index) => (
            <div className="content" key={index}>
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
  );
};

export default BoxEducationSkeleton;
