import React, { Component } from 'react';
import { RComponent } from '../../../common/r-component'
import PropTypes from 'prop-types'

import { getState, subscribe } from '../../../services/userService'
import { getPostState } from '../../../services/postService'
import { getCommentState, setCommentState } from '../../../services/commentService'

import getApiInstance from '../../../ajax/generic-api'

function getCaretPosition(editableDiv) {
    var caretPos = 0,
        sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            if (range.commonAncestorContainer.parentNode == editableDiv) {
                caretPos = range.endOffset;
            }
        }
    } else if (document.selection && document.selection.createRange) {
        range = document.selection.createRange();
        if (range.parentElement() == editableDiv) {
            var tempEl = document.createElement("span");
            editableDiv.insertBefore(tempEl, editableDiv.firstChild);
            var tempRange = range.duplicate();
            tempRange.moveToElementText(tempEl);
            tempRange.setEndPoint("EndToEnd", range);
            caretPos = tempRange.text.length;
        }
    }
    return caretPos;
}
class InsertComment extends RComponent {
    detectEnter = false
    static propTypes = {
        parentId: PropTypes.string
    }
    static defaultProps = {
        parentId: null
    }
    constructor(props) {
        super(props);

        this.state = {
            returnUrl: '/',
            isMobile: false,
            emojiPickerState: false,
            emojiPicker: null
        }

        this.onMount(() => {
            this.onUnmount(subscribe(() => this.forceUpdate()))
        })

        this.onMount(() => {
            let returnUrl = ''
            if (location && location.href) {
                returnUrl = location.href
            }
            let isMobile = true
            if (window.matchMedia("(min-width: 800px)").matches) {
                isMobile = false
            }
            this.setState({
                returnUrl: returnUrl,
                isMobile
            })
            this.initEmojiBox()
        })
    }

    initEmojiBox = async () => {
        await import("emoji-mart/css/emoji-mart.css");
        const { Picker } = await import("emoji-mart")
        this.setState({
            emojiPicker: <div className="input-emojibox">
                <Picker
                    title="Pick your emoji…"
                    emoji="point_up"
                    onSelect={emoji => this.insertEmoji(emoji.native)}
                />
            </div>
        })
    }

    addNewComment = (comment) => {
        const { postData } = getPostState()
        const user = getState()
        const { parentId } = this.props
        let data = {
            comment: comment,
            userId: user.id,
            parentId: parentId,
            postId: postData.id
        }
        getApiInstance().postWithBodyAuth({
            url: '/Post/InsertOrUpdateComment',
            data
        }).then(res => {
            if (res.successful) {
                const commentState = getCommentState()
                let newCommentState = {
                    commentLikeDislikeStat: [...commentState.commentLikeDislikeStat, res.result]
                }
                setCommentState({ ...commentState, ...newCommentState })
                this.inputComment.innerHTML = ''
            }
        }).catch(err => {
            console.error(err)
        })
    }

    handleKeydown = (e) => {
        const { isMobile } = this.state
        var keycode = e.charCode || e.keyCode;
        if (keycode == 13 && !isMobile) {
            if (!e.shiftKey) {
                this.detectEnter = true
                const value = e.target.innerHTML
                if (value) {
                    this.addNewComment(value)
                }
                return false;
            }
        }
    }

    send = () => {
        const value = this.inputComment.innerHTML
        if (value) {
            this.addNewComment(value)
        }
    }

    onInput = (e) => {
        if (this.detectEnter == true) {
            e.target.innerHTML = ''
            this.detectEnter = false
        }
    }

    toggleEmojiPicker = () => {
        this.setState({ emojiPickerState: !this.state.emojiPickerState })
    }

    insertEmoji = (emoji) => {
        this.inputComment.innerHTML = this.inputComment.innerHTML + emoji
    }

    render() {
        const user = getState()
        const { emojiPicker, emojiPickerState } = this.state
        if (user && user.username)
            return (
                <div className="input-comment-container">
                    <i className="material-icons">account_circle</i>
                    <div className="input-wrapper">
                        <div contentEditable={true}
                            ref={instance => this.inputComment = instance}
                            className="input-text"
                            placeholder="Viết bình luận ..."
                            onKeyDown={this.handleKeydown}
                            onInput={this.onInput}></div>
                        <div className="input-controls">
                            {emojiPickerState && emojiPicker}
                            {
                                emojiPicker &&
                                <i className="material-icons emoji-button" onClick={this.toggleEmojiPicker}>mood</i>
                            }
                            <i className="material-icons send-button" onClick={this.send}>send</i>
                        </div>
                    </div>
                </div>
            );
        const { returnUrl } = this.state
        return <div className="input-comment-require-auth">
            <a className="btn-try-now" href={`/account/login?returnUrl=${returnUrl}`}>Đăng nhập để bình luận</a>
        </div>
    }
}

export default InsertComment;