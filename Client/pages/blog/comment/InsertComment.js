import React, { Component } from 'react';
import { RComponent } from '../../../common/r-component'
import PropTypes from 'prop-types'

import { getState, subscribe } from '../../../services/userService'
import { getPostState } from '../../../services/postService'
import { getCommentState, setCommentState } from '../../../services/commentService'

import getApiInstance from '../../../ajax/generic-api'

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
            isMobile: false
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

            // const self = this
            // window.onresize = () => {
            //     let value = true
            //     if (window.matchMedia("(min-width: 800px)").matches) {
            //         value = false
            //     }
            //     self.handleWindowResize(value)
            // }
        })
    }

    // handleWindowResize = (value) => {
    //     this.setState({ isMobile: value })
    // }

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
    render() {
        const user = getState()
        if (user && user.username)
            return (
                <div className="input-comment-container">
                    <i className="material-icons">account_circle</i>
                    <div contentEditable={true}
                        ref={instance => this.inputComment = instance}
                        className="input-text"
                        placeholder="Viết bình luận ..."
                        onKeyDown={this.handleKeydown}
                        onInput={this.onInput}></div>
                    <i className="material-icons send-button" onClick={this.send}>send</i>
                </div>
            );
        const { returnUrl } = this.state
        return <div className="input-comment-require-auth">
            <a className="btn-try-now" href={`/account/login?returnUrl=${returnUrl}`}>Đăng nhập để bình luận</a>
        </div>
    }
}

export default InsertComment;