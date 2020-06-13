import React, { Component, Fragment } from 'react';
import s from './style.scss'
import withStyles from 'isomorphic-style-loader/withStyles'

class FirstZone extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }

    componentDidMount() {
        this.setState({
            isLoaded: true
        })
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

    render() {
        const { isLoaded } = this.state
        return (
            <div className="firstZone" id="firstZoneId">
                <div id="firstZoneBg">
                </div>
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