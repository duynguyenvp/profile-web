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
                        <div className="value1" data-aos="fade-down">ĐÂY LÀ THẾ GIỚI RIÊNG CỦA BẠN</div>
                        <div className="value2" data-aos="fade-up">Bạn có thể xây dựng trang cá nhân ngay bây giờ!</div>
                        <div data-aos="fade-up">
                            <button className="btn-view-more" onClick={this.viewMore}>
                                <i className="material-icons">arrow_downward</i>
                            </button>
                        </div>
                    </Fragment>
                }
            </div>
        );
    }
}

export default withStyles(s)(FirstZone);