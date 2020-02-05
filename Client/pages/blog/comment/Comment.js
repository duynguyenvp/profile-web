import React, { Component } from 'react';
import { RComponent } from '../../../common/r-component'

import InsertComment from './InsertComment'
import IconLike from '../../../common-resources/ic_like'
import IconDislike from '../../../common-resources/ic_dislike'

import { getState, subscribe } from '../../../services/userService'
import { getCommentState, setCommentState, subscribeComment } from '../../../services/commentService'

import getApiInstance from '../../../ajax/generic-api'

import { datetimeToStringFormatCultureVi } from '../../../utils/date-utils'

class Comment extends RComponent {
    constructor(props) {
        super(props);

        this.onMount(() => {
            this.onUnmount(subscribe(() => this.forceUpdate()))
        })

        this.state = {
            isReplyOn: false
        }
    }

    renderChilds = (list) => {
        list = list.sort((a, b) => {
            if (a.time < b.time) return -1
            if (a.time > b.time) return 1
            return 0
        })
        let result = []
        for (let i = 0; i < list.length; i++) {
            const cmt = list[i];
            result.push(<Comment key={i} {...cmt} />)
        }
        return result
    }

    likeAction = () => {
        const user = getState()
        const { commentId, dislike, isDislikeReact, isLikeReact, like } = this.props
        const { commentLikeDislikeStat, ...other } = getCommentState()
        let item = commentLikeDislikeStat.find(f => f.commentId == commentId)

        let newCommentLikeDislikeStat = [...commentLikeDislikeStat.filter(f => f.commentId != commentId), {
            ...item, ...{
                like: isLikeReact ? like - 1 : like + 1,
                dislike: isDislikeReact ? dislike - 1 : dislike,
                isLikeReact: !isLikeReact,
                isDislikeReact: false
            }
        }]
        //Gọi api
        getApiInstance().postWithFormAuth({
            url: '/Post/LikeComment',
            data: {
                UserId: user.id,
                Id: commentId
            }
        }).then(res => {
            if (!res.successful) {
                this.likeAction()
            } else {
                console.log(res)
            }
        }).catch(err => {
            console.error(err)
            this.likeAction()
        })
        setCommentState({
            ...other,
            commentLikeDislikeStat: newCommentLikeDislikeStat
        })
    }

    dislikeAction = () => {
        const user = getState()
        const { commentId, dislike, isDislikeReact, isLikeReact, like } = this.props
        const { commentLikeDislikeStat, ...other } = getCommentState()
        let item = commentLikeDislikeStat.find(f => f.commentId == commentId)

        let newCommentLikeDislikeStat = [...commentLikeDislikeStat.filter(f => f.commentId != commentId), {
            ...item, ...{
                dislike: isDislikeReact ? dislike - 1 : dislike + 1,
                like: isLikeReact ? like - 1 : like,
                isDislikeReact: !isDislikeReact,
                isLikeReact: false
            }
        }]
        //Gọi api
        getApiInstance().postWithFormAuth({
            url: '/Post/DislikeComment',
            data: {
                UserId: user.id,
                Id: commentId
            }
        }).then(res => {
            if (!res.successful) {
                this.dislikeAction()
            } else {
                console.log(res)
            }
        }).catch(err => {
            console.error(err)
            this.dislikeAction()
        })
        setCommentState({
            ...other,
            commentLikeDislikeStat: newCommentLikeDislikeStat
        })
    }

    render() {
        const {
            comment,
            commentId,
            commentParentId,
            dislike,
            isDislikeReact,
            isLikeReact,
            like,
            postId,
            time,
            userName,
            list
        } = this.props
        const user = getState()
        const isLogin = user != null && user.username != null
        const { isReplyOn } = this.state
        return (
            <div className="comment-item">
                <i className="material-icons">account_circle</i>
                <div className="comment-item-main">
                    <div className="container">
                        <div className="comment-info">
                            <span className="username">{userName}</span>
                            <span className="time">{datetimeToStringFormatCultureVi(time)}</span>
                        </div>
                        <div className="content" dangerouslySetInnerHTML={{ __html: comment }}>
                        </div>
                        <div className="comment-actions">
                            <button className={`comment-like ${isLikeReact ? "active" : ""}`} onClick={() => {
                                if (isLogin) {
                                    this.likeAction()
                                }
                            }}>
                                <IconLike />
                                <span>{like}</span>
                            </button>
                            <button className={`comment-dislike ${isDislikeReact ? "active" : ""}`} onClick={() => {
                                if (isLogin) {
                                    this.dislikeAction()
                                }
                            }}>
                                <IconDislike />
                                <span>{dislike}</span>
                            </button>
                            {
                                commentParentId == 0 && <button className="comment-reply"
                                    onClick={() => { this.setState({ isReplyOn: true }) }}>Trả lời</button>
                            }
                        </div>
                    </div>
                    {
                        commentParentId == 0 && (isReplyOn || list.length > 0) && <div className="comment-box-reply">
                            {isLogin && <InsertComment parentId={commentId} />}
                            {this.renderChilds(list)}
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default Comment;