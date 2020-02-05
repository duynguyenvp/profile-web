import React, { Component } from 'react';
import PropTypes from 'prop-types'

class Popup extends Component {
    static propTypes = {
        mini: PropTypes.bool,
        small: PropTypes.bool,
        large: PropTypes.bool,
        fullScreen: PropTypes.bool,
        close: PropTypes.func,
        duration: PropTypes.number,
        title: PropTypes.string
    }
    static defaultProps = {
        mini: false,
        small: false,
        large: false,
        fullScreen: false,
        close: () => { },
        duration: -1,
        title: ''
    }

    componentDidMount() {
        const { duration } = this.props
        const that = this
        duration > 0 && setTimeout(() => {
            that.close()
        }, duration);
    }

    close = () => {
        this.props.close()
    }
    getPopupClassname = () => {
        const { fullScreen, mini, small, large } = this.props
        return mini ? 'mini' : (small ? 'small' : (large ? 'large' : (fullScreen ? 'fullScreen' : '')))
    }
    render() {
        const { children, title } = this.props
        const className = this.getPopupClassname()
        return (
            <div className={`popup ${className}`}>
                <div className="popup-header">
                    <span>{title}</span>
                    <div className="icon" onClick={this.close}>
                    </div>
                </div>
                <div className="popup-content">
                    {children}
                </div>
            </div>
        );
    }
}

export default Popup;