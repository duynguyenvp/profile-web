import React, { Component, Suspense } from 'react';
import InitAlert from '../../common/alert'
import { gsap } from 'gsap/dist/gsap';
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
    constructor(props) {
        super(props)
        this.state = {
            isShirk: false,
            active: 'home',
            route: 'home'
        }

    }

    handleScroll = (e) => {
        const { active, isShirk, isDisplayPlane, route } = this.state
        let nextState = {
            active, isShirk, isDisplayPlane
        }
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

    GsapInit = async (route) => {
        //Chỉ thực hiện với trang chủ
        if (route != 'home') return
        let { ScrollTrigger } = await import('gsap/ScrollTrigger');
        gsap.registerPlugin(ScrollTrigger)
        gsap.core.globals("ScrollTrigger", ScrollTrigger)
        gsap.fromTo('#welcome-text-1', {
            y: -100,
            opacity: 0
        }, {
            scrollTrigger: {
                trigger: "#welcome-text-1"
            },
            y: 0,
            opacity: 1,
            duration: .8
        })
        gsap.fromTo('#welcome-text-2', {
            y: 100,
            opacity: 0
        }, {
            scrollTrigger: {
                trigger: "#welcome-text-2"
            },
            y: 0,
            opacity: 1,
            duration: .8
        })

        var secondZoneTimeline = gsap.timeline({
            scrollTrigger: {
                scroller: "#app",
                trigger: ".secondZone",
                start: "top center",
                end: "top"
            }
        });

        secondZoneTimeline.from(".secondZone p", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .8 })
        .from(".secondZone .secondZoneRightPanel", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .4 }, "-=0.6")
        .from(".secondZone .btn-try-now", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .3 }, "-=.4")
        var thirdZoneTimeline = gsap.timeline({
            scrollTrigger: {
                scroller: "#app",
                trigger: ".thirdZone",
                start: "top center",
                end: "top"
            }
        });
        
        thirdZoneTimeline.from(".thirdZone .thirdZoneRightPanel", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .8 })
        .from(".thirdZone p", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .4 }, "-=0.6")
        .from(".thirdZone .btn-try-now", { scale: 0.3, rotation: 45, autoAlpha: 0, ease: "power2", duration: .3 }, "-=.4")
    }

    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll, true);
        InitAlert()

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
        this.GsapInit(newRoute);
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
                <div className="plane"
                    style={{ display: isDisplayPlane ? 'flex' : 'none' }}
                    onClick={this.gotoTop}>
                    <i className="material-icons">keyboard_arrow_up</i>
                </div>
            </React.Fragment>
        );
    }
}
export default withStyles(s)(App);