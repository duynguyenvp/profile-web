import React, {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import PropTypes from "prop-types";
import getApiInstance from "../../../ajax/generic-api";
import { dateToStringFormatCultureVi } from "../../../utils/date-utils";
import { setPostState, usePostService } from "../../../services/postService";
import useStyles from "isomorphic-style-loader/useStyles";
import style from "../style.scss";

import BoxComment from "./box-comment";
import BoxSearch from "./box-search/BoxSearch";
import BoxRecentPosts from "./box-recent-post";
import BoxTimeline from "./box-timeline";
import FbShareButton from "./FbShareButton";

const Blog = (props) => {
  useStyles(style);
  const [timeline, setTimeline] = useState([]);
  const [menuFixed, setMenuFixed] = useState(false);
  const [asideOpen, setAsideOpen] = useState(false);
  const [username, setUsername] = useState();
  const postFromService = usePostService();
  const post = useMemo(() => ({ ...props, ...postFromService }), [
    postFromService,
    props,
  ]);

  useEffect(() => {
    let pathname = window.location.pathname;
    pathname = pathname.split(/\//);
    let username = "";
    if (pathname && pathname.length && pathname[2] != "bai-viet") {
      username = pathname[2];
    }
    username = username && username.length > 0 ? username : "duynguyen";
    setUsername(username);
  }, []);
  useEffect(() => {
    initData();
  }, []);

  const handleScroll = (e) => {
    const app = document.getElementById("blog__body");
    if (app.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      setMenuFixed(true);
    } else {
      setMenuFixed(false);
    }
  };

  useLayoutEffect(() => {
    window.addEventListener("scroll", handleScroll, true);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useLayoutEffect(() => {
    function handleWindowResize() {
      console.log(1);
      const blog = document.getElementById("blog__body");
      const plane = document.querySelector(".plane");
      if (!blog || !plane) return;
      const { right } = blog.getBoundingClientRect() || {};
      const planeRight = window.innerWidth - (right || 0);
      plane.style.right = `${planeRight > 0 ? planeRight : 0}px`;
    }
    handleWindowResize();
    window.addEventListener("resize", handleWindowResize, true);
    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const initData = () => {
    const { postData, ...restOfProps } = props;
    const { title, content, postTime } = postData || {};
    const newPostData = {
      ...postData,
      title: title == "{title}" ? "" : title,
      content: content == "{content}" ? "" : content,
      postTime: postTime == "{postTime}" ? "" : postTime,
    };
    setPostState({ postData: newPostData, ...restOfProps });
    delete window.__INITIAL__DATA__;
  };

  const changePost = (postId) => {
    setAsideOpen(false);
    getApiInstance()
      .postWithForm({
        url: "/post/GetPostById",
        data: {
          id: postId,
        },
      })
      .then((res) => {
        if (res.successful && res.result) {
          const { postData } = res.result || {};
          const { title } = postData || {};
          if (title) {
            document.title = title;
          }
          setPostState(res.result);
          const app = document.getElementById("app");
          app.scrollTo({
            top: 0,
            left: 0,
            behavior: "smooth",
          });
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const renderFacebookControls = useCallback(() => {
    const { postData } = post;
    const { postUrl } = postData;
    if (!postUrl) return null;
    return (
      <div className="box-social-controls">
        <FbShareButton postUrl={postUrl} />
      </div>
    );
  }, [post]);

  const asideToggle = () => {
    setAsideOpen(!asideOpen);
  };

  const { postData } = post;
  const { content, title, postTime, userName } = postData;

  return (
    <section id="blog" className={`blog ${menuFixed ? "blog--marginTop" : ""}`}>
      {!asideOpen && (
        <button
          className="blog__btnAsideToggle"
          onClick={() => {
            setAsideOpen(true);
          }}
        >
          <i className="material-icons">chevron_right</i>
        </button>
      )}
      <aside
        className={`blog__aside blog__aside--width ${
          asideOpen ? "blog__aside--open" : ""
        }`}
      >
        <button
          className="blog__btnAsideToggle blog__btnAsideToggle--close"
          onClick={() => {
            setAsideOpen(false);
          }}
        >
          <i className="material-icons">chevron_left</i> Đóng lại
        </button>
        <BoxSearch changePost={changePost} />
        <BoxRecentPosts username={username} changePost={changePost} />
        <BoxTimeline username={username} changePost={changePost} />
      </aside>
      <section id="blog__body" className="blog__body">
        <article className="content">
          {!content && !title && !postTime ? (
            <Fragment>
              <h1>Chưa có bài viết nào.</h1>
              <a href="/quan-tri/blog-post" className="content__btnAddNew">
                Tạo mới bài viết ở đây
              </a>
            </Fragment>
          ) : (
            <Fragment>
              <div className="post-header">
                <span className="post-title">{title}</span>
                <span className="post-time">
                  <span>Ngày đăng: &nbsp;</span>
                  <span>
                    {postTime != "{postTime}"
                      ? dateToStringFormatCultureVi(postTime)
                      : postTime}
                  </span>
                </span>
                <span className="post-author">
                  <span>Tác giả: &nbsp;</span>
                  <span>{userName || ""}</span>
                </span>
              </div>
              <div
                className="post-content"
                dangerouslySetInnerHTML={{ __html: content }}
              ></div>
              {renderFacebookControls()}
            </Fragment>
          )}
        </article>
        <section className="blog__comments">
          <BoxComment />
        </section>
      </section>
    </section>
  );
};

Blog.propTypes = {
  postData: PropTypes.object,
  suggestions: PropTypes.array,
};

Blog.defaultProps = {
  postData: {
    content: "{content}",
    id: null,
    postTime: "{postTime}",
    tag: "",
    title: "{title}",
  },
  suggestions: [],
};

export default Blog;
