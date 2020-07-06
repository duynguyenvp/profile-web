import React, { Component, Fragment } from 'react';
import s from './style.scss'
import withStyles from 'isomorphic-style-loader/withStyles'

class FirstZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            isMobile: true,
            isShowPicture: true
        }
    }

    componentDidMount() {
        let isMobile = true
        if (window.matchMedia("(min-width: 900px)").matches) {
            isMobile = false
        }
        this.setState({
            isLoaded: true,
            isMobile
        }, () => {
            this.hidePicture()
        })
    }

    hidePicture = () => {
        const { isMobile } = this.state
        if (isMobile) return
        setTimeout(() => {
            this.setState({ isShowPicture: false })
        }, 1500);
    }

    viewMore = () => {
        const zone = document.getElementById('secondZoneId')
        const app = document.getElementById('app');
        app.scrollTo({
            top: zone ? zone.offsetTop - 200 : 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    renderBackground = () => {
        const { isLoaded, } = this.state
        if (isLoaded && !isMobile)
            return
        <Fragment></Fragment>
    }

    render() {
        const { isLoaded, isMobile, isShowPicture } = this.state
        return (
            <div className="firstZone" id="firstZoneId">
                {
                    isLoaded && !isMobile && <video id="firstZoneBg"
                        controls
                        autoPlay
                        muted
                        loop
                        className="first-zone-video-background">
                        <source src={'/video'} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                }
                {
                    isShowPicture && <picture id="firstZoneBg">
                        <source type="image/webp" srcSet="dist/images/bg-header.webp" />
                        <source type="image/jpeg" srcSet="dist/images/bg-header.jpg" />
                        <img src="dist/images/bg-header.jpg" alt="" />
                    </picture>
                }
                {
                    isLoaded && <Fragment>
                        <div className="value1" id="welcome-text-1">ĐÂY LÀ THẾ GIỚI RIÊNG CỦA BẠN</div>
                        <div className="value2" id="welcome-text-2">Bạn có thể xây dựng trang cá nhân ngay bây giờ!</div>
                        <button className="btn-view-more" onClick={this.viewMore}>
                            <i className="material-icons">keyboard_arrow_down</i>
                        </button>
                    </Fragment>
                }
            </div>
        );
    }
}

export default withStyles(s)(FirstZone);
