import React from "react";
import Skeleton from "react-loading-skeleton";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";

const mockArray = (length) => {
  let array = [];
  for (let index = 0; index < length; index++) {
    array.push(index);
  }
  return array;
};

const BoxInfomationSkeleton = () => {
  useStyles(style);
  const skills = mockArray(6);

  return (
    <div className={`boxInfo`}>
      <div className="boxInfo__avatar">
        <Skeleton height={250} width={250} />
      </div>
      <div className="boxInfo__container">
        <Skeleton height={26} />
        <p className="boxInfo__container__field">
          <Skeleton width={250} />
        </p>
        <p className="boxInfo__container__field">
          <Skeleton width={250} />
        </p>
        <p className="boxInfo__container__field">
          <Skeleton width={250} />
        </p>
        <p className="boxInfo__container__field">
          <Skeleton width={250} />
        </p>
        <p className="boxInfo__container__field">
          <Skeleton width={250} />
        </p>
        <hr />
        <p className="boxInfo__container__field boxInfo__container__field--title">
          <Skeleton height={26} width={250} />
        </p>
        <div className="boxInfo__container__skills">
          {skills &&
            skills.map(() => {
              return (
                <>
                  <Skeleton width={100} />
                  <Skeleton width={250} />
                </>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default BoxInfomationSkeleton;
