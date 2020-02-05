import FirstZone from './first-zone'
import SecondZone from './second-zone'
import ThirdZone from './third-zone'
import FourthZone from './fourth-zone'

import React, { Component } from 'react';

class Home extends Component {
    render() {
        return (
            <React.Fragment>
                <FirstZone />
                <SecondZone />
                <ThirdZone />
                <FourthZone />
            </React.Fragment>
        );
    }
}

export default Home;