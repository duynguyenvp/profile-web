import React, { Component } from "react";
import PropTypes from "prop-types";

import {
  getState,
  subscribe,
  unsubscribe
} from "../../../../services/userService";
import { getPostState } from "../../../../services/postService";
import {
  getCommentState,
  setCommentState
} from "../../../../services/commentService";
import getApiInstance from "../../../../ajax/generic-api";

class InsertComment extends Component {
  detectEnter = false;

  unsubscribeFuncs = [];

  static propTypes = {
    parentId: PropTypes.string
  };

  static defaultProps = {
    parentId: null
  };

  constructor(props) {
    super(props);

    this.state = {
      returnUrl: "/",
      isMobile: false,
      Picker: null,
      emojiPickerState: false,
      emojiPickerShouldUp: false
    };
  }

  componentDidMount() {
    let returnUrl = "";
    if (window.location && window.location.href) {
      returnUrl = window.location.href;
    }
    let isMobile = true;
    if (window.matchMedia("(min-width: 800px)").matches) {
      isMobile = false;
    }
    this.setState({
      returnUrl,
      isMobile
    });
    this.initEmojiBox();
    this.unsubscribeFuncs = subscribe(() => this.forceUpdate());
  }

  componentWillUnmount() {
    unsubscribe(this.unsubscribeFuncs());
  }

  initEmojiBox = async () => {
    await import("emoji-mart/css/emoji-mart.css");
    const { Picker } = await import("emoji-mart");
    this.setState({ Picker });
  };

  renderEmojiPicker = () => {
    const { Picker, emojiPickerState, emojiPickerShouldUp } = this.state;
    if (emojiPickerState && Picker) {
      return (
        <div
          className={`input-emojibox ${emojiPickerShouldUp ? "up" : "down"}`}
          id="input-emojibox"
        >
          <Picker
            title="Pick your emoji…"
            emoji="point_up"
            set="facebook"
            native
            onSelect={emoji => this.insertEmoji(emoji.native)}
          />
        </div>
      );
    }

    return null;
  };

  addNewComment = comment => {
    const { postData } = getPostState();
    const user = getState();
    const { parentId } = this.props;
    const data = {
      userId: user.id,
      postId: postData.id,
      parentId,
      comment
    };
    getApiInstance()
      .postWithBodyAuth({
        url: "/Post/InsertOrUpdateComment",
        data
      })
      .then(res => {
        if (res.successful) {
          const commentState = getCommentState();
          const newCommentState = {
            commentLikeDislikeStat: [
              ...commentState.commentLikeDislikeStat,
              res.result
            ]
          };
          setCommentState({ ...commentState, ...newCommentState });
          this.inputComment.innerHTML = "";
        }
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleKeydown = e => {
    const { isMobile } = this.state;
    const keycode = e.charCode || e.keyCode;
    if (keycode === 13 && !isMobile) {
      if (!e.shiftKey) {
        this.detectEnter = true;
        const value = e.target.innerHTML;
        if (value) {
          this.addNewComment(value);
        }
        return false;
      }
    }
    return true;
  };

  send = () => {
    const value = this.inputComment.innerHTML;
    if (value) {
      this.addNewComment(value);
    }
  };

  onInput = e => {
    if (this.detectEnter === true) {
      e.target.innerHTML = "";
      this.detectEnter = false;
    }
  };

  toggleEmojiPicker = () => {
    const { emojiPickerState, isMobile } = this.state;
    if (emojiPickerState) {
      this.setState({ emojiPickerState: false });
    } else {
      const app = document.getElementById("app");
      const inputControls = document.getElementsByClassName(
        "input-controls"
      )[0];
      const boundingClientRect = inputControls.getBoundingClientRect();
      const top = boundingClientRect.top;
      const bottom = app.clientHeight - boundingClientRect.bottom;
      let emojiPickerShouldUp = false;
      if (!isMobile && top > bottom) {
        emojiPickerShouldUp = true;
      }
      this.setState({ emojiPickerState: true, emojiPickerShouldUp });
    }
  };

  insertEmoji = emoji => {
    this.inputComment.innerHTML = this.inputComment.innerHTML + emoji;
  };

  render() {
    const user = getState();
    const { Picker } = this.state;
    if (user && user.username) {
      return (
        <div className="input-comment-container">
          <i className="material-icons">account_circle</i>
          <div className="input-wrapper">
            <div
              contentEditable
              ref={instance => (this.inputComment = instance)}
              className="input-text"
              placeholder="Viết bình luận ..."
              onKeyDown={this.handleKeydown}
              onInput={this.onInput}
            />
            <div className="input-controls">
              {this.renderEmojiPicker()}
              {Picker && (
                <i
                  className="material-icons emoji-button"
                  onClick={this.toggleEmojiPicker}
                >
                  mood
                </i>
              )}
              <i className="material-icons send-button" onClick={this.send}>
                send
              </i>
            </div>
          </div>
        </div>
      );
    }
    const { returnUrl } = this.state;
    return (
      <div className="input-comment-require-auth">
        <a
          className="btn-try-now"
          href={`/account/login?returnUrl=${returnUrl}`}
        >
          Đăng nhập để bình luận
        </a>
      </div>
    );
  }
}

export default InsertComment;
