import React, { useState, useEffect, useMemo } from 'react'
import Skeleton from 'react-loading-skeleton';
import getApiInstance from '../../../ajax/generic-api';
import useStyles from 'isomorphic-style-loader/useStyles'
import style from './style.scss'

const BoxTimeline = ({ username, changePost }) => {
    useStyles(style);
    const [loading, setLoading] = useState(true)
    const [timeline, setTimeline] = useState([])

    const timelineItemToggle = (item) => {
        const newTimeline = timeline.filter(f => f.id != item.id)
        setTimeline([...newTimeline, { ...item, ...{ isOpen: !item.isOpen } }])
    }

    const getTimelineData = _username => {
        setLoading(true)
        getApiInstance().getWithQueryString({
            url: '/Post/PostGetTimeline',
            data: {
                Username: _username
            }
        }).then(res => {
            setLoading(false)
            if (res.successful) {
                const _timeline = res.result.map(item => {
                    let firstPart = item.id.slice(0, -4)
                    let secondPart = item.id.slice(-4);
                    return { ...item, id: secondPart + firstPart, isOpen: false }
                })
                setTimeline(_timeline)
            }
        }).catch(err => {
            setLoading(false)
            console.error(err)
        })
    }

    useEffect(() => {
        if (username) {
            getTimelineData(username)
        }
    }, [username])

    const renderPosts = useMemo(() => {
        if (loading) {
            let skeletons = []
            for (let index = 0; index < 5; index++) {
                const post = <li key={index} className="timeline-li" key={index}>
                    <Skeleton width={250} height={24} style={{ margin: "16px 0" }} />
                </li>
                skeletons.push(post)
            }
            return skeletons
        }
        if (timeline && timeline.length) {
            return timeline.sort((a, b) => {
                if (a.id > b.id) return -1
                if (a.id < b.id) return 1
                return 0
            }).map((item, index) => {
                return <li key={index} className="timeline-li">
                    <div className="timeline-item"
                        onClick={() => { timelineItemToggle(item) }}>
                        <i className={`material-icons timeline-item-icon ${item.isOpen ? "down" : ""}`}>chevron_right</i>
                        <span>{item.name}</span>
                    </div>
                    <ul className={`nested ${item.isOpen ? 'active' : ''}`}>
                        {
                            item.listPost && item.listPost.map(post =>
                                <li key={post.postId}>
                                    <a href={post.postUrl} onClick={e => { e.preventDefault(); changePost(post.postId) }}>{post.postTitle}</a>
                                </li>
                            )
                        }
                    </ul>
                </li>
            })
        }
        return <h4>Không có dữ liệu</h4>
    }, [loading, timeline])

    return <div className="box-timeline">
        <h2 className="box-title">Dòng thời gian</h2>
        <ul id="timelineUL">
            {renderPosts}
        </ul>
    </div>
}

export default BoxTimeline