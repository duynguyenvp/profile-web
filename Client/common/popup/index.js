import './style.scss'

import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom'

import { getPopups, subscribe, unsubscribe, removePopup, PopupContext } from '../../services/popupService'

import Popup from './Popup'
class PopupContainer extends Component {
    isMounted = false;
    subcribes = []

    componentDidMount() {
        this.isMounted = true;
        this.subcribes = subscribe(() => {
            if (this.isMounted)
                this.forceUpdate()
        })
    }

    componentWillUnmount() {
        this.isMounted = false
        unsubscribe(this.subcribes)
    }

    render() {
        const popups = getPopups();
        const listPopup = popups.map((item, index) => {
            return <Fragment key={item.id}>
                <PopupContext.Provider value={{ popupId: item.id, onClose: () => { removePopup(item.id) } }}>
                    <Popup
                        mini={item.mini}
                        small={item.small}
                        large={item.large}
                        fullScreen={item.fullScreen}
                        title={item.title}
                        duration={item.duration}
                        close={() => { removePopup(item.id); }}>
                        {item.children}
                    </Popup>
                </PopupContext.Provider>
            </Fragment>
        })
        return (
            <React.Fragment>
                {popups && popups.length && <div className="popup-background"></div>}
                {listPopup}
            </React.Fragment>
        );
    }
}

export default () => {
    let popupContainer = document.getElementById('popup-container');
    if (!popupContainer) {
        popupContainer = document.createElement('div');
        popupContainer.setAttribute('id', 'popup-container');
        popupContainer.setAttribute('class', 'popup-container');
        document.body.appendChild(popupContainer);
    }
    ReactDOM.render(<PopupContainer />, popupContainer)
};