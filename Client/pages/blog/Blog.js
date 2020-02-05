import React, { Fragment } from 'react';
import { RComponent } from '../../common/r-component'
import s from './style.scss'
import BoxComment from './comment';
import PropTypes from 'prop-types'
import getApiInstance from '../../ajax/generic-api'
import { dateToStringFormatCultureVi } from '../../utils/date-utils'
import { getPostState, setPostState, subscribePost } from '../../services/postService'
import withStyles from 'isomorphic-style-loader/withStyles'
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
            postRecently: []
        }

        this.onMount(() => {
            let pathname = window.location.pathname
            pathname = pathname.split(/\//)
            let username = ''
            if (pathname && pathname.length && pathname[2] != 'bai-viet') {
                username = pathname[2]
            }
            username = username && username.length > 0 ? username : "duynguyen"
            this.getTimelineData(username)
            this.getPostRecently(username)
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

    getTimelineData = (Username) => {
        getApiInstance().getWithQueryString({
            url: '/Post/PostGetTimeline',
            data: {
                Username
            }
        }).then(res => {
            if (res.successful) {
                const timeline = res.result.map(item => {
                    let firstPart = item.id.slice(0, -4)
                    let secondPart = item.id.slice(-4);
                    return { ...item, id: secondPart + firstPart, isOpen: false }
                })
                this.setState({ timeline })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    getPostRecently = (Username) => {
        getApiInstance().postWithForm({
            url: '/Post/GetPostRecently',
            data: {
                Username
            }
        }).then(res => {
            if (res.successful) {
                this.setState({ postRecently: res.result })
            }
        }).catch(err => {
            console.error(err)
        })
    }

    timelineItemToggle = (item) => {
        const { timeline } = this.state
        const newTimeline = timeline.filter(f => f.id != item.id)
        this.setState({
            timeline: [...newTimeline, { ...item, ...{ isOpen: !item.isOpen } }]
        })
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
                <iframe src={path}
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
        const { content, title, postTime } = postData
        const { timeline, postRecently } = this.state

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
                                        </div>
                                        <div className="post-content" dangerouslySetInnerHTML={{ __html: content }}>
                                        </div>
                                        {
                                            this.renderFacebookControls()
                                        }
                                        <hr />
                                        {/* <div className="suggestion">
                                            <h3>Có thể bạn quan tâm</h3>
                                            <div className="suggestion-body">
                                                <div className="suggestion-item" onClick={() => {
                                                    var newPostData = { title: 'Test title' }
                                                    setState({
                                                        postData: { ...postData, ...newPostData },
                                                        suggestions
                                                    })
                                                }}>
                                                    <div className="suggestion-item-avatar"></div>
                                                    <span className="suggestion-item-title">Bài viết liên quan, cùng chủ đề, vân vân</span>
                                                </div>
                                                <div className="suggestion-item">
                                                    <div className="suggestion-item-avatar"></div>
                                                    <span className="suggestion-item-title">Bài viết liên quan, cùng chủ đề, vân vân</span>
                                                </div>
                                                <div className="suggestion-item">
                                                    <div className="suggestion-item-avatar"></div>
                                                    <span className="suggestion-item-title">Bài viết liên quan, cùng chủ đề, vân vân</span>
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className="box-comment">
                                        <BoxComment />
                                    </div>
                                </Fragment>
                        }
                    </div>
                    <div className="right-side">
                        <div className="recent">
                            <h2 className="box-title">Bài viết mới nhất</h2>
                            <div className="recent-body">
                                {
                                    postRecently && postRecently.length ? postRecently.sort((a, b) => {
                                        if (a.postTime > b.postTime) return -1
                                        if (a.postTime < b.postTime) return 1
                                        return 0
                                    }).map((item, i) => {
                                        return (
                                            <React.Fragment key={i}>
                                                <div className="recent-item" onClick={() => { this.changePost(item.id) }}>
                                                    <div className="recent-item-avatar"></div>
                                                    <div className="recent-item-title">
                                                        <a href={item.postUrl} onClick={e => { e.preventDefault(); this.changePost(item.id) }}><p>{item.title}</p></a>
                                                    </div>
                                                </div>
                                                {postRecently.length > i ? <hr /> : null}
                                            </React.Fragment>
                                        )
                                    })
                                        : <h4>Không có dữ liệu</h4>
                                }
                            </div>
                        </div>
                        <div className="timeline">
                            <h2 className="box-title">Dòng thời gian</h2>
                            <ul id="timelineUL">
                                {
                                    timeline && timeline.length ? timeline.sort((a, b) => {
                                        if (a.id > b.id) return -1
                                        if (a.id < b.id) return 1
                                        return 0
                                    }).map((item, index) => {
                                        return <li key={index}>
                                            <span className={`caret ${item.isOpen ? 'caret-down' : ''}`}
                                                onClick={() => { this.timelineItemToggle(item) }}>{item.name}</span>
                                            <ul className={`nested ${item.isOpen ? 'active' : ''}`}>
                                                {
                                                    item.listPost && item.listPost.map(post =>
                                                        <li key={post.postId}>
                                                            <a href={post.postUrl} onClick={e => { e.preventDefault(); this.changePost(post.postId) }}>{post.postTitle}</a>
                                                        </li>
                                                    )
                                                }
                                            </ul>
                                        </li>
                                    }) : <h4>Không có dữ liệu</h4>
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(Blog);