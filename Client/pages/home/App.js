import React, { Component, Suspense } from 'react';
import InitAlert from '../../common/alert'
import 'aos/dist/aos.css';
let AOS = null
let SmoothScroll = null

import Menu from './menu'
import s from './App.scss'
import withStyles from 'isomorphic-style-loader/withStyles'

import getApiInstance from '../../ajax/generic-api'
import { setState } from '../../services/userService'

const menuMeta = [
    { idMenu: 'home', idContent: 'firstZoneId' },
    { idMenu: 'about', idContent: 'secondZoneId' },
    { idMenu: 'contact', idContent: 'thirdZoneId' }
]

class App extends Component {
    state = {
        isShirk: false,
        active: 'home',
        route: 'home'
    }
    handleScroll = (e) => {
        AOS && AOS.refresh()
        const { active, isShirk, isDisplayPlane, route } = this.state
        let nextState = {
            active, isShirk, isDisplayPlane
        }
        const app = document.getElementById('app');
        if (app.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            nextState = { ...nextState, isShirk: true, isDisplayPlane: true };
        } else {
            nextState = { ...nextState, isShirk: false, isDisplayPlane: false };
        }
        const pageYOffset = app.scrollTop;
        const firstZoneBg = document.getElementById('firstZoneBg')
        if (firstZoneBg) {
            firstZoneBg.style.opacity = 1 - (pageYOffset / 700) + ''
        }
        if (
            nextState.active !== this.state.active
            || nextState.isShirk !== this.state.isShirk
            || nextState.isDisplayPlane !== this.state.isDisplayPlane
        ) {
            this.setState(nextState)
        }
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);
        InitAlert()

        import('aos').then(aos => {
            AOS = aos.default
            AOS && AOS.init({
                duration: 1000,
                offset: 200
            });
        })

        import('smoothscroll-polyfill').then(smoothscroll => {
            SmoothScroll = smoothscroll.default
            SmoothScroll && SmoothScroll.polyfill();
        })

        let pathname = window.location.pathname
        pathname = pathname.split(/\//)
        let newRoute = 'home'
        let active = 'home'
        if (pathname.indexOf('bai-viet') != -1) {
            newRoute = 'bai-viet'
            active = 'blog'
        }
        if (pathname.indexOf('resume') != -1) {
            newRoute = 'resume'
            active = 'resume'
        }
        this.setState({
            route: newRoute
        }, () => {
            this.routeDerection({ active, route: newRoute })
        })

        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserInfo'
        }).then(res => {
            if (res.successful) {
                setState(res.result)
            }
        }).catch(err => {
            console.error(err)
        })
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    gotoTop = () => {
        try {
            const app = document.getElementById('app');
            app.scrollTo({
                top: 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error(error)
        }
    }

    routeDerection = ({ id, active, route: newRoute }) => {
        const { route } = this.state
        if (newRoute != route) {
            if (id == 'blog' || id == 'resume') {
                window.location = `/${newRoute}`
                return
            }
            window.location = `/${newRoute}/#${active}`
            return
        }
        let tempID = id
        if (!tempID) {
            const menu = menuMeta.find(f => f.idMenu == active)
            if (menu) {
                tempID = menu.idContent
            }
        }
        try {
            const zone = document.getElementById(tempID)
            const app = document.getElementById('app');
            app.scrollTo({
                top: zone ? zone.offsetTop : 0,
                left: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error(error)
        }

        this.setState({
            active: active
        })
    }

    render() {
        const { isShirk, isDisplayPlane, active } = this.state
        return (
            <React.Fragment>
                <Menu isShirk={isShirk} active={active} routeDerection={this.routeDerection} />
                {
                    this.props.children
                }
                <div className="plane" style={{ display: isDisplayPlane ? 'flex' : 'none' }} onClick={this.gotoTop}>
                    <i className="material-icons">keyboard_arrow_up</i>
                </div>
            </React.Fragment>
        );
    }
}
export default withStyles(s)(App);