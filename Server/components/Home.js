import React, { Component } from 'react';
import App from '../../Client/App'
import Home from '../../Client/pages/home/Home'

class HomePage extends Component {
    render() {
        return (
            <React.Fragment>
                <App>
                    <Home />
                </App>
            </React.Fragment>
        );
    }
}

export default HomePage;