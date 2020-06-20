import SecondZone from './second-zone'
import useStyles from 'isomorphic-style-loader/useStyles'
import s from './resumePrint.scss'
import React from 'react';
const Home = ({ resume }) => {
    useStyles(s);
    return <SecondZone isPrint={true} {...resume} />
}

export default Home