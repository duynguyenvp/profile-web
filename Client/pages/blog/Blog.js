import React, { Fragment } from 'react';
import { RComponent } from '../../common/r-component'
import s from './style.scss'
import PropTypes from 'prop-types'
import getApiInstance from '../../ajax/generic-api'
import { dateToStringFormatCultureVi } from '../../utils/date-utils'
import { getPostState, setPostState, subscribePost } from '../../services/postService'
import withStyles from 'isomorphic-style-loader/withStyles'
import BoxComment from './box-comment';
import BoxSearch from './box-search/BoxSearch'
import BoxRecentPosts from './box-recent-post';
import BoxTimeline from './box-timeline';
class Blog extends RComponent {
    static propTypes = {
        postData: PropTypes.object,
        suggestions: PropTypes.array,
    }
    static defaultProps = {
        postData: {
            content: '{content}',
            id: null,
            postTime: '{postTime}',
            tag: '',
            title: '{title}'
        },
        suggestions: []
    }

    constructor(props) {
        super(props);
        this.state = {
            timeline: [],
            username: null
        }
        this.onMount(() => {
            let pathname = window.location.pathname
            pathname = pathname.split(/\//)
            let username = ''
            if (pathname && pathname.length && pathname[2] != 'bai-viet') {
                username = pathname[2]
            }
            username = username && username.length > 0 ? username : "duynguyen"
            this.setState({ username })
            this.initData()
        })
        this.onMount(() => {
            this.onUnmount(subscribePost(() => this.forceUpdate()))
        })
    }

    initData = () => {
        const { postData, ...restOfProps } = this.props
        const { title, content, postTime } = postData || {}
        const newPostData = {
            ...postData,
            title: title == '{title}' ? '' : title,
            content: content == '{content}' ? '' : content,
            postTime: postTime == '{postTime}' ? '' : postTime,
        }
        setPostState({ postData: newPostData, ...restOfProps })
        delete window.__INITIAL__DATA__
    }

    changePost = (postId) => {
        getApiInstance().postWithForm({
            url: '/post/GetPostById',
            data: {
                id: postId
            }
        }).then(res => {
            if (res.successful && res.result) {
                const { postData } = res.result || {}
                const { title } = postData || {}
                if (title) {
                    document.title = title
                }
                setPostState(res.result)
                const app = document.getElementById("app")
                app.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth'
                })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    renderFacebookControls = () => {
        const { postData } = { ...this.props, ...getPostState() }
        const { postUrl } = postData
        if (!postUrl) return null
        const urlEncoded = encodeURIComponent(`http://somethingaboutme.info${postUrl}`)
        const fbAppId = '141492096686724'
        const path = `https://www.facebook.com/plugins/share_button.php?href=${urlEncoded}&layout=button&size=small&appId=${fbAppId}&width=76&height=20`
        return (
            <div className="box-social-controls">
                <iframe title="Facebook share pluggin"
                    src={path}
                    width="76"
                    height="20"
                    style={{ border: "none", overflow: "hidden" }}
                    scrolling="no"
                    frameBorder="0"
                    allowtransparency="true"
                    allow="encrypted-media"></iframe>
            </div>
        )
    }

    render() {
        const { postData, suggestions } = { ...this.props, ...getPostState() }
        const { content, title, postTime, userName } = postData
        const { username } = this.state

        return (
            <div className="blog">
                <div className="blog-content">
                    <div className="left-side">
                        {
                            !content && !title && !postTime ?
                                <Fragment>
                                    <h1>Chưa có bài viết nào.</h1>
                                    <a href="/quan-tri/blog-post" className="btn-add-new">Tạo mới bài viết ở đây</a>
                                </Fragment> :
                                <Fragment>
                                    <div className="main-post">
                                        <div className="post-header">
                                            <span className="post-title">{title}</span>
                                            <span className="post-time">
                                                <span>Ngày đăng: &nbsp;</span>
                                                <span>{postTime != "{postTime}" ? dateToStringFormatCultureVi(postTime) : postTime}</span>
                                            </span>
                                            <span className="post-author">
                                                <span>Tác giả: &nbsp;</span>
                                                <span>{userName || ""}</span>
                                            </span>
                                        </div>
                                        <div className="post-content" dangerouslySetInnerHTML={{ __html: content }}>
                                        </div>
                                        {
                                            this.renderFacebookControls()
                                        }
                                    </div>
                                    <BoxComment />
                                </Fragment>
                        }
                    </div>
                    <div className="right-side">
                        <BoxSearch changePost={this.changePost} />
                        <BoxRecentPosts username={username} changePost={this.changePost} />
                        <BoxTimeline username={username} changePost={this.changePost} />
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(Blog);