import React, { Fragment, useEffect, useMemo } from "react";
import Comment from "./Comment";

import { getState } from "../../../../services/userService";
import { usePostService } from "../../../../services/postService";
import {
  useCommentService,
  setCommentState
} from "../../../../services/commentService";

import getApiInstance from "../../../../ajax/generic-api";

const List = () => {
  const { commentLikeDislikeStat } = useCommentService();
  const { postData } = usePostService();
  const user = getState();

  useEffect(() => {
    getData();
  }, [user, postData]);

  const getData = () => {
    if (!postData || !postData.id) return;
    const data = {
      postId: postData.id,
      userId: user.id
    };
    getApiInstance()
      .postWithForm({
        url: "/Post/PostStatLikeDislike",
        data
      })
      .then((res) => {
        if (res.successful && res.result) {
          setCommentState(res.result);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const computeComment = useMemo(() => {
    let list = [...commentLikeDislikeStat];
    const listChild = list.filter(f => f.commentParentId !== 0);
    list = list
      .filter(f => f.commentParentId === 0)
      .sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      });
    const listCommentComponent = [];
    for (let i = 0; i < list.length; i += 1) {
      const comment = list[i];
      const listChildOfComment = listChild.filter(
        f => f.commentParentId === comment.commentId
      );
      const props = {
        ...comment,
        list: listChildOfComment
      };
      listCommentComponent.push(<Comment key={i} {...props} />);
    }
    return listCommentComponent;
  }, [commentLikeDislikeStat]);

  return <Fragment>{computeComment}</Fragment>;
};

export default List;
