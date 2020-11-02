import React, { useState, useEffect, useMemo } from "react";
import Skeleton from "react-loading-skeleton";
import getApiInstance from "../../../../ajax/generic-api";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "./style.scss";

const getIndex = (year, month) => {
  try {
    let result = Number(year);
    result *= 100;
    result += Number(month);
    return result;
  } catch (error) {
    return Number(year);
  }
};

const BoxTimeline = ({ username, changePost }) => {
  useStyles(style);
  const [loading, setLoading] = useState(true);
  const [timeline, setTimeline] = useState([]);

  const timelineItemToggle = (item) => {
    const newTimeline = timeline.filter((f) => f.id != item.id);
    setTimeline([...newTimeline, { ...item, ...{ isOpen: !item.isOpen } }]);
  };

  const getTimelineData = (_username) => {
    setLoading(true);
    getApiInstance()
      .getWithQueryString({
        url: "/Post/PostGetTimeline",
        data: {
          Username: _username,
        },
      })
      .then((res) => {
        setLoading(false);
        if (res.successful) {
          const _timeline = res.result.map((item) => {
            let firstPart = item.id.slice(0, -4);
            let secondPart = item.id.slice(-4);
            return {
              ...item,
              id: secondPart + firstPart,
              isOpen: false,
              index: getIndex(secondPart, firstPart),
            };
          });
          setTimeline(_timeline);
        }
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    if (username) {
      getTimelineData(username);
    }
  }, [username]);

  const renderPosts = useMemo(() => {
    if (loading) {
      let skeletons = [];
      for (let index = 0; index < 5; index++) {
        const post = (
          <li key={index} className="timeline-li" key={index}>
            <Skeleton width={250} height={24} style={{ margin: "16px 0" }} />
          </li>
        );
        skeletons.push(post);
      }
      return skeletons;
    }
    if (timeline && timeline.length) {
      return timeline
        .sort((a, b) => {
          if (a.index > b.index) return -1;
          if (a.index < b.index) return 1;
          return 0;
        })
        .map((item, index) => {
          return (
            <li key={index} className="timeline-li">
              <div
                className="timelineItem"
                onClick={() => {
                  timelineItemToggle(item);
                }}
              >
                <i
                  className={`material-icons timelineItem__icon ${
                    item.isOpen ? "timelineItem__icon--down" : ""
                  }`}
                >
                  chevron_right
                </i>
                <span>{item.name}</span>
              </div>
              <ul className={`nested ${item.isOpen ? "active" : ""}`}>
                {item.listPost &&
                  item.listPost.map((post) => (
                    <li key={post.postId}>
                      <a
                        href={post.postUrl}
                        onClick={(e) => {
                          e.preventDefault();
                          changePost(post.postId);
                        }}
                      >
                        {post.postTitle}
                      </a>
                    </li>
                  ))}
              </ul>
            </li>
          );
        });
    }
    return <h4>Không có dữ liệu</h4>;
  }, [loading, timeline]);

  return (
    <div className="boxTimeline">
      <h2 className="boxTimeline__title">Dòng thời gian</h2>
      <ul className="boxTimeline__Body">{renderPosts}</ul>
    </div>
  );
};

export default BoxTimeline;
