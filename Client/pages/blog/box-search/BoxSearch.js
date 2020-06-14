import React, { useState, useEffect } from 'react'
import getApiInstance from '../../../ajax/generic-api'

import useStyles from 'isomorphic-style-loader/useStyles'
import s from './style.scss'

const BoxSearch = ({ changePost }) => {
    let typingTimer;
    const doneTypingInterval = 1500;
    useStyles(s);
    const [searchResults, setSearchResults] = useState(null)
    const [keyword, setKeyword] = useState("")
    const [currentUsername, setCurrentUsername] = useState("")
    const [isSearching, setIsSearching] = useState(false)
    const [isShowStatus, setIsShowStatus] = useState(false)

    useEffect(() => {
        let pathname = window.location.pathname
        pathname = pathname.split(/\//)
        let username = ''
        if (pathname && pathname.length && pathname[2] != 'bai-viet') {
            username = pathname[2]
        }
        username = username && username.length > 0 ? username : "duynguyen"
        setCurrentUsername(username)
    }, [])

    const onChange = e => {
        const value = e.target.value
        setKeyword(value)
    }

    const onKeyDown = e => {
        clearTimeout(typingTimer);
        var keycode = e.charCode || e.keyCode;
        if (keycode == 13) {
            search()
        }
    }

    const onKeyUp = e => {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    }

    const doneTyping = () => {
        if (!keyword) onRefresh();
    }

    const search = () => {
        setIsSearching(true)
        setIsShowStatus(true)
        getApiInstance().postWithForm({
            url: '/Post/FullTextSearch',
            data: {
                Condition: keyword,
                Username: currentUsername
            }
        }).then(res => {
            setIsSearching(false)
            if (res.successful) {
                setSearchResults(res.result.data)
            }
        }).catch(err => {
            setIsSearching(false)
            console.error(err)
        })
    }

    const onRefresh = () => {
        setKeyword("")
        setSearchResults(null)
        setIsShowStatus(false)
    }

    return <div className="box-search">
        <div className="box-header">
            <input
                className="input-search-text"
                placeholder="Nhập từ khóa tìm kiềm ..."
                value={keyword}
                onChange={onChange}
                onKeyUp={onKeyUp}
                onKeyDown={onKeyDown} />
            <button
                className="btn-refresh"
                onClick={onRefresh}>Làm mới</button>
        </div>
        <div className="box-body">
            {
                isSearching && <h5 className="box-search-status">Đang tìm kiếm...</h5>
            }
            {
                isShowStatus && keyword && !isSearching && <h5 className="box-search-status">Đã tìm thấy {(searchResults && searchResults.length) || 0} bài viết</h5>
            }
            {
                keyword && !isSearching && searchResults && searchResults.length && searchResults.map((item, i) => {
                    return (
                        <React.Fragment key={i}>
                            <div className="search-item" onClick={() => { this.changePost(item.id) }}>
                                <div className="search-item-avatar"></div>
                                <div className="search-item-title">
                                    <a href={item.postUrl} onClick={e => { e.preventDefault(); changePost(item.id) }}><p>{item.title}</p></a>
                                </div>
                            </div>
                            {searchResults.length > i ? <hr /> : null}
                        </React.Fragment>
                    )
                })
            }
        </div>
    </div>
}

export default BoxSearch