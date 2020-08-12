import React from 'react'
import { RComponent } from '../../../common/r-component'
import s from './index.scss'
import withClickOutside from '../../../common/high-order-components/with-onclick-outside'
import { getState, subscribe, resetState } from '../../../services/userService'

import getApiInstance from '../../../ajax/generic-api'
import withStyles from 'isomorphic-style-loader/withStyles'
import BoxUserMenu from './boxUser'

class Menu extends RComponent {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isReady: false,
            isMobile: false
        }

        this.onMount(() => {
            this.setState({ isReady: true })
        })
        this.onMount(() => {
            var x = window.matchMedia("(max-width: 900px)")
            this.matchMedia(x)
            x.addListener(this.matchMedia)
        })
        this.onMount(() => {
            this.onUnmount(subscribe(() => {
                this.forceUpdate()
            }))
        })
    }

    matchMedia = (event) => {
        if (event.matches) {
            this.setState({ isMobile: true })
        } else {
            this.setState({ isMobile: false })
        }
    }

    menuClick = (data) => {
        this.props.routeDerection(data)
    }

    handleClickOutside = () => {
        const { isOpen } = this.state
        if (isOpen) {
            this.setState({
                isOpen: !isOpen
            })
        }
    }

    sigout = () => {
        getApiInstance('/account').signout().then(res => {
            if (res.successful) {
                resetState()
            }
        }).catch(err => {
            console.error(err)
        })
    }

    render() {
        const { isOpen, isMobile, isReady } = this.state
        const { isShirk, active } = this.props

        const user = getState()

        return (
            <div className={`topnav ${isShirk ? 'shrink' : ''}`} id="myTopnav">
                <div className="nav-container">
                    <div id="nav-toggle" className={isOpen ? "active" : ""}>
                        <div className="btn-menu-toggle" onClick={() => {
                            this.setState({
                                isOpen: !isOpen
                            })
                        }}>
                            <span></span>
                        </div>
                        {
                            isMobile && <BoxUserMenu user={user} isReady={isReady} sigout={this.sigout} />
                        }
                    </div>
                    <div className={`nav-items ${isReady ? "ready" : ""} ${isMobile ? "mobile" : ""} ${isOpen ? "active" : ""}`}>
                        <a href="/#home" className={active == "home" ? "active" : ""}
                            onClick={() => { this.menuClick({ id: 'firstZoneId', active: 'home', route: 'home' }) }}>
                            <span>Trang chủ</span>
                        </a>
                        <a href="/#about" className={active == "about" ? "active" : ""}
                            onClick={() => { this.menuClick({ id: 'secondZoneId', active: 'about', route: 'home' }) }}>
                            <span>Giới thiệu</span>
                        </a>
                        <a href="/#contact" className={active == "contact" ? "active" : ""}
                            onClick={() => { this.menuClick({ id: 'thirdZoneId', active: 'contact', route: 'home' }) }}>
                            <span>Liên hệ</span>
                        </a>
                        <a href={`/resume/view/${user.username && user.username || ''}`} className={active == "resume" ? "active" : ""}
                            onClick={() => { this.menuClick({ id: 'resume', active: 'resume', route: `/resume/view/${user.username && user.username || ''}` }) }}>
                            <span>Resume</span>
                        </a>
                        <a href={`/bai-viet/${user.username && user.username + '/' || ''}`} className={active == "blog" ? "active" : ""}
                            onClick={() => { this.menuClick({ id: 'blog', active: 'blog', route: `/bai-viet/${user.username && user.username + '/' || ''}` }) }}>
                            <span>Blog</span>
                        </a>
                        {
                            !isMobile && <BoxUserMenu user={user} isReady={isReady} sigout={this.sigout} />
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default withStyles(s)(withClickOutside(Menu));