import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { useUserService } from "../../../../services/userService";
import { usePostService } from "../../../../services/postService";
import {
  setCommentState,
  useCommentService
} from "../../../../services/commentService";
import getApiInstance from "../../../../ajax/generic-api";

const InsertComment = ({ parentId }) => {
  const [returnUrl, setReturnUrl] = useState("/");
  const [isMobile, setIsMobile] = useState(false);
  const [PickerComponent, setPickerComponent] = useState(null);
  const [emojiPickerState, setEmojiPickerState] = useState(false);
  const [emojiPickerShouldUp, setEmojiPickerShouldUp] = useState(false);

  const { postData } = usePostService();
  const user = useUserService();
  const commentState = useCommentService();

  const textInput = useRef(null);
  const detectEnter = useRef(null);

  useEffect(() => {
    let nextReturnUrl = "";
    if (window.location && window.location.href) {
      nextReturnUrl = window.location.href;
    }
    let nextIsMobile = true;
    if (window.matchMedia("(min-width: 800px)").matches) {
      nextIsMobile = false;
    }
    setReturnUrl(nextReturnUrl);
    setIsMobile(nextIsMobile);
  }, []);
  useLayoutEffect(() => {
    initEmojiBox();
  }, []);
  const initEmojiBox = async () => {
    await import("emoji-mart/css/emoji-mart.css");
    const { Picker } = await import("emoji-mart");
    setPickerComponent(Picker);
  };
  const renderEmojiPicker = useMemo(() => {
    if (emojiPickerState && PickerComponent) {
      return (
        <div
          className={`input-emojibox ${emojiPickerShouldUp ? "up" : "down"}`}
          id="input-emojibox"
        >
          <PickerComponent
            title="Pick your emoji…"
            emoji="point_up"
            set="facebook"
            native
            onSelect={emoji => insertEmoji(emoji.native)}
          />
        </div>
      );
    }

    return null;
  }, [emojiPickerState, PickerComponent]);

  const addNewComment = comment => {
    const data = {
      comment,
      userId: user.id,
      parentId,
      postId: postData.id
    };
    getApiInstance()
      .postWithBodyAuth({
        url: "/Post/InsertOrUpdateComment",
        data
      })
      .then(res => {
        if (res.successful) {
          const newCommentState = {
            commentLikeDislikeStat: [
              ...commentState.commentLikeDislikeStat,
              res.result
            ]
          };
          setCommentState({ ...commentState, ...newCommentState });
          textInput.innerHTML = "";
        }
      })
      .catch(err => {
        console.error(err);
      });
  };
  const handleKeydown = e => {
    const keycode = e.charCode || e.keyCode;
    if (keycode === 13 && !isMobile) {
      if (!e.shiftKey) {
        detectEnter.current = true;
        const value = e.target.innerHTML;
        if (value) {
          addNewComment(value);
        }
        return false;
      }
    }
    return true;
  };
  const send = () => {
    const value = textInput.innerHTML;
    if (value) {
      addNewComment(value);
    }
  };
  const onInput = e => {
    if (detectEnter.current === true) {
      e.target.innerHTML = "";
      detectEnter.current = false;
    }
  };

  const toggleEmojiPicker = () => {
    if (emojiPickerState) {
      setEmojiPickerState(false);
    } else {
      const app = document.getElementById("app");
      const inputControls = document.getElementsByClassName(
        "input-controls"
      )[0];
      const boundingClientRect = inputControls.getBoundingClientRect();
      const { top } = boundingClientRect;
      const bottom = app.clientHeight - boundingClientRect.bottom;
      let nextEmojiPickerShouldUp = false;
      if (!isMobile && top > bottom) {
        nextEmojiPickerShouldUp = true;
      }
      setEmojiPickerState(true);
      setEmojiPickerShouldUp(nextEmojiPickerShouldUp);
    }
  };

  const insertEmoji = emoji => {
    textInput.innerHTML += emoji;
  };

  if (user && user.username) {
    return (
      <div className="input-comment-container">
        <i className="material-icons">account_circle</i>
        <div className="input-wrapper">
          <div
            contentEditable
            ref={textInput}
            className="input-text"
            placeholder="Viết bình luận ..."
            onKeyDown={handleKeydown}
            onInput={onInput}
          />
          <div className="input-controls">
            {renderEmojiPicker()}
            {PickerComponent && (
              <i
                className="material-icons emoji-button"
                onClick={toggleEmojiPicker}
              >
                mood
              </i>
            )}
            <i className="material-icons send-button" onClick={send}>
              send
            </i>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="input-comment-require-auth">
      <a className="btn-try-now" href={`/account/login?returnUrl=${returnUrl}`}>
        Đăng nhập để bình luận
      </a>
    </div>
  );
};

export default InsertComment;
