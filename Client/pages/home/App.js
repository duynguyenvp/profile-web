import React, { useState, useLayoutEffect, useEffect } from 'react';
import InitAlert from '../../common/alert'
import { gsap } from 'gsap/dist/gsap';
let SmoothScroll = null

import Menu from './menu'
import s from './App.scss'
import useStyles from 'isomorphic-style-loader/useStyles'

import getApiInstance from '../../ajax/generic-api'
import { setState } from '../../services/userService'

const menuMeta = [
    { idMenu: 'home', idContent: 'firstZoneId' },
    { idMenu: 'about', idContent: 'secondZoneId' },
    { idMenu: 'contact', idContent: 'fourthZoneId' }
]

const App = ({ children }) => {
    useStyles(s)
    const [isShirk, setIsShirk] = useState(() => false)
    const [active, setActive] = useState(() => 'home')
    const [route, setRoute] = useState(() => '')
    const [isDisplayPlane, setIsDisplayPlane] = useState(() => false)

    useLayoutEffect(() => {
        const memoGsap = async () => {
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
                duration: .5
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
                duration: .5
            })

            let secondZoneTimeline = gsap.timeline({
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
            let thirdZoneTimeline = gsap.timeline({
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
        if (route === 'home') {
            memoGsap()
        }
    }, [route])

    const handleScroll = (e) => {
        let nextIsShirk, nextIsDisplayPlane;
        if (app.scrollTop > 80 || document.documentElement.scrollTop > 80) {
            nextIsShirk = true
            nextIsDisplayPlane = true
        } else {
            nextIsShirk = false
            nextIsDisplayPlane = false
        }
        const pageYOffset = app.scrollTop;
        const firstZoneBg = document.getElementById('firstZoneBg')
        if (firstZoneBg) {
            firstZoneBg.style.opacity = 1 - (pageYOffset / 700) + ''
        }
        setIsShirk(() => nextIsShirk)
        setIsDisplayPlane(() => nextIsDisplayPlane)
    }

    useLayoutEffect(() => {
        window.addEventListener('scroll', handleScroll, true);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [])
    useEffect(() => {
        InitAlert()
        import('smoothscroll-polyfill').then(smoothscroll => {
            SmoothScroll = smoothscroll.default
            SmoothScroll && SmoothScroll.polyfill();
        })
        let pathname = window.location.pathname
        pathname = pathname.split(/\//)
        let nextRoute = 'home'
        let nextActive = ''
        if (pathname.indexOf('bai-viet') != -1) {
            nextRoute = 'bai-viet'
            nextActive = 'blog'
        }
        if (pathname.indexOf('resume') != -1) {
            nextRoute = 'resume'
            nextActive = 'resume'
        }
        if (window.location.hash) {
            nextActive = window.location.hash.substr(1)
        }
        setRoute(() => nextRoute)
        setActive(() => nextActive || 'home')
    }, [])

    useLayoutEffect(() => {
        console.log(active, route)
        routeDerection({ active, route })
    }, [active, route])

    useEffect(() => {
        getApiInstance().getWithQueryStringAuth({
            url: '/User/UserInfo'
        }).then(res => {
            if (res.successful) {
                setState(res.result)
            }
        }).catch(err => {
            console.error(err)
        })
    }, [])

    const routeDerection = ({ id, active, route: newRoute }) => {
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
        setActive(active)
    }

    const gotoTop = () => {
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

    return <>
        <Menu isShirk={isShirk} active={active} routeDerection={routeDerection} />
        {children}
        <div className="plane"
            style={{ display: isDisplayPlane ? 'flex' : 'none' }}
            onClick={gotoTop}>
            <i className="material-icons">keyboard_arrow_up</i>
        </div>
    </>
}

export default App;