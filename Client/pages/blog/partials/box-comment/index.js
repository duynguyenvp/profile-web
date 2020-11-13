import React from "react";
import useStyles from "isomorphic-style-loader/useStyles";
import s from "./comment.scss";

import List from "./List";
import InsertComment from "./InsertComment";

const BoxComment = () => {
  useStyles(s);
  return (
    <div className="box-comment">
      <h3>Bình luận</h3>
      <InsertComment />
      <List />
    </div>
  );
};

export default BoxComment;
