import React, { useState, useEffect, useMemo } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useStyles from "isomorphic-style-loader/useStyles";
import getApiInstance from "../../../../ajax/generic-api";
import style from "./style.scss";
import { dateToStringFormatCultureVi } from "../../../../utils/date-utils";

const BoxRecentPosts = ({ username, changePost }) => {
  useStyles(style);
  const [loading, setLoading] = useState(true);
  const [postRecently, setPostRecently] = useState([]);

  const getPostRecently = user => {
    setLoading(true);
    getApiInstance()
      .postWithForm({
        url: "/Post/GetPostRecently",
        data: {
          Username: user
        }
      })
      .then(res => {
        setLoading(false);
        if (res.successful) {
          setPostRecently(res.result);
        }
      })
      .catch(err => {
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    if (username) {
      getPostRecently(username);
    }
  }, [username]);

  const renderPosts = useMemo(() => {
    if (loading) {
      const skeletons = [];
      for (let index = 0; index < 5; index += 1) {
        const post = (
          <React.Fragment key={index}>
            <div className="post">
              <div className="post__title">
                <SkeletonTheme color="#a2a2a2" highlightColor="#adadad">
                  <Skeleton width={150} />
                  <Skeleton width={250} />
                </SkeletonTheme>
              </div>
            </div>
          </React.Fragment>
        );
        skeletons.push(post);
      }
      return skeletons;
    }
    if (postRecently && postRecently.length) {
      return postRecently
        .sort((a, b) => {
          if (a.postTime > b.postTime) return -1;
          if (a.postTime < b.postTime) return 1;
          return 0;
        })
        .map((item, i) => (
          <React.Fragment key={i}>
            <div className="post">
              <div className="post__title">
                <a
                  href={item.postUrl}
                  onClick={e => {
                    e.preventDefault();
                    changePost(item.id);
                  }}
                >
                  <p className="post__postTime">
                    {dateToStringFormatCultureVi(item.postTime)}
                  </p>
                  <p>{item.title}</p>
                </a>
              </div>
            </div>
          </React.Fragment>
        ));
    }
    return <h4>Không có dữ liệu</h4>;
  }, [loading, postRecently]);

  return (
    <div className="boxRecentPost">
      <h2 className="boxRecentPost__title">Bài viết mới nhất</h2>
      <div className="boxRecentPost__body">{renderPosts}</div>
    </div>
  );
};

export default BoxRecentPosts;
