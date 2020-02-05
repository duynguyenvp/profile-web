import React, { Component } from 'react';
import App from '../../Client/pages/home2/App'
import Home from '../../Client/pages/home2/Home'

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