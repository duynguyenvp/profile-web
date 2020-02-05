import React, { Component } from 'react'
import { RComponent } from '../../../common/r-component'
import './style.scss'
import withClickOutside from '../../../common/high-order-components/with-onclick-outside'
import { getState, setState, subscribe, resetState } from '../../../services/userService'
import IconSignout from '../../../common-resources/ic_signout'
import IconHome from '../../../common-resources/ic_home'

import getApiInstance from '../../../ajax/generic-api'

class Navigator extends RComponent {
    constructor(props) {
        super(props);

        this.onMount(() => {
            getApiInstance().getWithQueryStringAuth({
                url: '/User/UserInfo'
            }).then(res => {
                if (res.successful) {
                    setState(res.result)
                }
            }).catch(err => {
                console.error(err)
            })
        })

        this.onMount(() => {
            this.onUnmount(subscribe(() => {
                this.forceUpdate()
            }))
        })
    }

    handleClickOutside = () => {
        const { active, handleActiveNavigator } = this.props
        if (active) {
            handleActiveNavigator(!active)
        }
    }

    signout = () => {
        getApiInstance('/account').signout().then(res => {
            if (res.successful) {
                resetState()
                window.location.reload();
            }
        }).catch(err => {
            console.error(err)
        })
    }
    signin = () => {
        signout().then(res => {
            if (res.successful) {
                resetState()
            }
        }).catch(err => {
            console.error(err)
        })
    }

    render() {
        const { active, handleActiveNavigator } = this.props

        const user = getState()
        const isLogin = user && user.username

        return (
            <div className={`topnav`} id="myTopnav">
                <div id="nav-toggle" className={active ? "active" : ""} onClick={() => {
                    handleActiveNavigator(!active)
                }}><span></span></div>
                <a href="/" className="icon-home"><IconHome /></a>
                <h3>Quản trị</h3>
                {
                    isLogin && <div className="nav-user-info">
                        <span>Chào </span>
                        <span className="username">{user.username || ""}</span>
                        <button className="btn-logout" onClick={this.signout}>
                            <IconSignout />
                        </button>
                    </div>
                }
            </div>
        );
    }
}

export default withClickOutside(Navigator);