import React, { useState } from 'react'
import withClickOutside from '../../../common/high-order-components/reacthook-withClickOutside'
import IconSignout from '../../../common-resources/ic_signout'

const BoxUserMenu = ({ user, isReady, sigout }) => {
    const [isOpen, setIsOpen] = useState(false)
    const ref = withClickOutside({
        handler: () => {
            setIsOpen(!isOpen)
        }
    })

    const isLogin = user && user.username
    if (!isReady) return null
    return isLogin ? <div className="nav-user-info" ref={ref}>
        <span onClick={() => {
            setIsOpen(!isOpen)
        }} id="user-info-greeting">Chào <strong>{user.username || ""}</strong></span>
        <ul className="user-info-menu" style={{display: isOpen ? "block" : "none"}}>
            <li>
                <a href="/quan-tri">
                    <i className="material-icons">settings</i> Quản trị
                    </a>
            </li>
            <li>
                <a href="#" onClick={sigout}>
                    <IconSignout /> Đăng xuất
                    </a>
            </li>
        </ul>
    </div>
        : <div className="nav-user-info">
            <a href='/account/login' className="btn-login">
                Đăng nhập
                </a>
        </div>
}

export default BoxUserMenu