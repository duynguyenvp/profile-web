import ResumeBody from './resume-body'
import useStyles from 'isomorphic-style-loader/useStyles'
import s from './resumePrint.scss'
import React from 'react';
const Home = ({ resume }) => {
    useStyles(s);
    return <ResumeBody isPrint={true} {...resume} />
}

export default Home