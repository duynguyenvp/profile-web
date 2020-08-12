import React, { useState, useEffect, useMemo } from 'react'
import Skeleton from 'react-loading-skeleton';
import getApiInstance from '../../../ajax/generic-api';
import useStyles from 'isomorphic-style-loader/useStyles'
import style from './style.scss'

const BoxRecentPosts = ({ username, changePost }) => {
    useStyles(style);
    const [loading, setLoading] = useState(true)
    const [postRecently, setPostRecently] = useState([])

    const getPostRecently = _username => {
        setLoading(true)
        getApiInstance().postWithForm({
            url: '/Post/GetPostRecently',
            data: {
                Username: _username
            }
        }).then(res => {
            setLoading(false)
            if (res.successful) {
                setPostRecently(res.result)
            }
        }).catch(err => {
            setLoading(false)
            console.error(err)
        })
    }

    useEffect(() => {
        getPostRecently(username)
    }, [username])

    const renderPosts = useMemo(() => {
        if (loading) {
            let skeletons = []
            for (let index = 0; index < 5; index++) {
                const post = <React.Fragment key={index}>
                    <div className="recent-post">
                        <Skeleton width={60} circle={true} height={60} />
                        <div className="recent-post-title">
                            <Skeleton width={250} count={2} />
                        </div>
                    </div>
                    {4 - 1 > index ? <hr /> : null}
                </React.Fragment>
                skeletons.push(post)
            }
            return skeletons
        }
        if (postRecently && postRecently.length) {
            return postRecently.sort((a, b) => {
                if (a.postTime > b.postTime) return -1
                if (a.postTime < b.postTime) return 1
                return 0
            }).map((item, i) => {
                return (
                    <React.Fragment key={i}>
                        <div className="recent-post" onClick={() => { changePost(item.id) }}>
                            <div className="recent-post-avatar"></div>
                            <div className="recent-post-title">
                                <a href={item.postUrl} onClick={e => { e.preventDefault(); changePost(item.id) }}><p>{item.title}</p></a>
                            </div>
                        </div>
                        {postRecently.length - 1 > i ? <hr /> : null}
                    </React.Fragment>
                )
            })
        }
        return <h4>Không có dữ liệu</h4>
    }, [loading, postRecently])

    return <div className="box-recent-post">
        <h2 className="box-title">Bài viết mới nhất</h2>
        <div className="recent-body">
            {renderPosts}
        </div>
    </div>
}

export default BoxRecentPosts