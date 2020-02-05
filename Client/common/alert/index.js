import './style.scss'

import React, { Fragment } from 'react';
import { RComponent } from '../../common/r-component'
import ReactDOM from 'react-dom'

import { getAlerts, subscribe, unsubscribe, removeAlert } from '../../services/alertService'

import Alert from './Alert'
class AlertContainer extends RComponent {
    constructor(props) {
        super(props);
        
        this.onMount(() => {
            this.onUnmount(subscribe(() => this.forceUpdate()))
        })
    }

    render() {
        const alerts = getAlerts();
        const listAlert = alerts.map((item, index) => {
            return <Fragment key={item.id}>
                <Alert
                    type={item.type}
                    duration={item.duration}
                    message={item.message}
                    callback={() => { removeAlert(item.id); }}
                    close={() => { removeAlert(item.id); }} />
            </Fragment>
        })
        return (
            <React.Fragment>
                {listAlert}
            </React.Fragment>
        );
    }
}

export default () => {
    let alertContainer = document.getElementById('alert-container');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        const app = document.getElementById('app')
        alertContainer.setAttribute('id', 'alert-container');
        alertContainer.setAttribute('class', 'alert-container');
        app.appendChild(alertContainer);
    }
    ReactDOM.render(<AlertContainer />, alertContainer)
};