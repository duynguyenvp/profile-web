import React, { useCallback, useState } from "react";

import InsertComment from "./InsertComment";
import IconLike from "../../../../assets/ic_like";
import IconDislike from "../../../../assets/ic_dislike";

import { useUserService } from "../../../../services/userService";
import {
  getCommentState,
  setCommentState
} from "../../../../services/commentService";

import getApiInstance from "../../../../ajax/generic-api";

import { datetimeToStringFormatCultureVi } from "../../../../utils/date-utils";

const Comment = ({
  comment,
  commentId,
  commentParentId,
  dislike,
  isDislikeReact,
  isLikeReact,
  like,
  time,
  userName,
  list
}) => {
  const [isReplyOn, setIsReplyOn] = useState(false);
  const user = useUserService();
  const renderChilds = useCallback(list => {
    const listSorted = list.sort((a, b) => {
      if (a.time < b.time) return -1;
      if (a.time > b.time) return 1;
      return 0;
    });
    const result = [];
    for (let i = 0; i < listSorted.length; i += 1) {
      const cmt = listSorted[i];
      result.push(<Comment key={i} {...cmt} />);
    }
    return result;
  }, []);

  const likeAction = () => {
    const { commentLikeDislikeStat, ...other } = getCommentState();
    const item = commentLikeDislikeStat.find(f => f.commentId === commentId);

    const newCommentLikeDislikeStat = [
      ...commentLikeDislikeStat.filter(f => f.commentId !== commentId),
      {
        ...item,
        ...{
          like: isLikeReact ? like - 1 : like + 1,
          dislike: isDislikeReact ? dislike - 1 : dislike,
          isLikeReact: !isLikeReact,
          isDislikeReact: false
        }
      }
    ];
    // Gọi api
    getApiInstance()
      .postWithFormAuth({
        url: "/Post/LikeComment",
        data: {
          UserId: user.id,
          Id: commentId
        }
      })
      .then(res => {
        if (!res.successful) {
          likeAction();
        } else {
          console.error(res);
        }
      })
      .catch(err => {
        console.error(err);
      });
    setCommentState({
      ...other,
      commentLikeDislikeStat: newCommentLikeDislikeStat
    });
  };

  const dislikeAction = () => {
    const { commentLikeDislikeStat, ...other } = getCommentState();
    const item = commentLikeDislikeStat.find(f => f.commentId === commentId);

    const newCommentLikeDislikeStat = [
      ...commentLikeDislikeStat.filter(f => f.commentId !== commentId),
      {
        ...item,
        ...{
          dislike: isDislikeReact ? dislike - 1 : dislike + 1,
          like: isLikeReact ? like - 1 : like,
          isDislikeReact: !isDislikeReact,
          isLikeReact: false
        }
      }
    ];
    // Gọi api
    getApiInstance()
      .postWithFormAuth({
        url: "/Post/DislikeComment",
        data: {
          UserId: user.id,
          Id: commentId
        }
      })
      .then(res => {
        if (!res.successful) {
          dislikeAction();
        } else {
          console.error(res);
        }
      })
      .catch(err => {
        console.error(err);
      });
    setCommentState({
      ...other,
      commentLikeDislikeStat: newCommentLikeDislikeStat
    });
  };

  const isLogin = user != null && user.username !== null;

  return (
    <div className="comment-item">
      <i className="material-icons">account_circle</i>
      <div className="comment-item-main">
        <div className="container">
          <div className="comment-info">
            <span className="username">{userName}</span>
            <span className="time">
              {datetimeToStringFormatCultureVi(time)}
            </span>
          </div>
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: comment }}
          />
          <div className="comment-actions">
            <button
              className={`comment-like ${isLikeReact ? "active" : ""}`}
              onClick={() => {
                if (isLogin) {
                  likeAction();
                }
              }}
            >
              <IconLike />
              <span>{like}</span>
            </button>
            <button
              className={`comment-dislike ${isDislikeReact ? "active" : ""}`}
              onClick={() => {
                if (isLogin) {
                  dislikeAction();
                }
              }}
            >
              <IconDislike />
              <span>{dislike}</span>
            </button>
            {commentParentId === 0 && (
              <button
                className="comment-reply"
                onClick={() => {
                  setIsReplyOn(true);
                }}
              >
                Trả lời
              </button>
            )}
          </div>
        </div>
        {commentParentId === 0 && (isReplyOn || list.length > 0) && (
          <div className="comment-box-reply">
            {isLogin && <InsertComment parentId={commentId} />}
            {renderChilds(list)}
          </div>
        )}
      </div>
    </div>
  );
};
export default Comment;
