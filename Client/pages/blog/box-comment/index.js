import React, { Component, Fragment } from 'react';
import s from './comment.scss'
import withStyles from 'isomorphic-style-loader/withStyles'

import List from './List'
import InsertComment from './InsertComment'

class BoxComment extends Component {
    render() {
        return (
            <div className="box-comment">
                <h2>Bình luận</h2>
                <InsertComment />
                <List />
            </div>
        );
    }
}

export default withStyles(s)(BoxComment);