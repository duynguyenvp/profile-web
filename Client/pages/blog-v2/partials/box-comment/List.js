import React, { Fragment } from "react";
import Comment from "./Comment";
import { RComponent } from "../../../../common/r-component";

import { getState, subscribe } from "../../../../services/userService";
import { getPostState, subscribePost } from "../../../../services/postService";
import {
  getCommentState,
  setCommentState,
  subscribeComment,
} from "../../../../services/commentService";

import getApiInstance from "../../../../ajax/generic-api";

class List extends RComponent {
  constructor(props) {
    super(props);
    this.onMount(() => {
      this.onUnmount(subscribeComment(() => this.forceUpdate()));
    });

    this.onMount(() => {
      this.onUnmount(subscribePost(() => this.getData()));
    });

    this.onMount(() => {
      this.onUnmount(subscribe(() => this.getData()));
    });
  }

  getData = () => {
    const user = getState();
    const { postData } = getPostState();
    if (!postData.id) return;
    let data = {
      postId: postData.id,
      userId: user.id,
    };
    getApiInstance()
      .postWithForm({
        url: "/Post/PostStatLikeDislike",
        data,
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

  computeComment = () => {
    const { commentLikeDislikeStat } = getCommentState();
    let list = [...commentLikeDislikeStat];
    let listChild = list.filter((f) => f.commentParentId !== 0);
    list = list
      .filter((f) => f.commentParentId == 0)
      .sort((a, b) => {
        if (a.time < b.time) return -1;
        if (a.time > b.time) return 1;
        return 0;
      });
    let listCommentComponent = [];
    for (let i = 0; i < list.length; i++) {
      let comment = list[i];
      let listChildOfComment = listChild.filter(
        (f) => f.commentParentId === comment.commentId
      );
      let props = {
        ...comment,
        list: listChildOfComment,
      };
      listCommentComponent.push(<Comment key={i} {...props} />);
    }
    return listCommentComponent;
  };

  render() {
    const list = this.computeComment();
    return <Fragment>{list}</Fragment>;
  }
}

export default List;
