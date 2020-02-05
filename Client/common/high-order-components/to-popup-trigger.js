import React, { Component, Fragment } from 'react';
import {getDisplayName} from './utils.js'
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';

function Transition(props) {
    return <Slide direction="up" {...props} />;
}


const withPopupTrigger = function (WrappedComponent) {
    class Wrapper extends Component {
        state = {
            open: false
        }

        handleClose = () => {
            this.setState({open: false});
        }

        handleOpen = () => {
            this.setState({open: true});
        }

        renderDialog = () => {
            const {open} = this.state;
            return (
                <Dialog disableEnforceFocus
                        open={open}
                        onClose={this.handleClose}
                        TransitionComponent={Transition}>
                    <Profile/>
                </Dialog>
            )
        }

        render() {
            return (
                <Fragment>
                    {this.props.children(this.handleOpen)}
                    <Dialog disableEnforceFocus
                            open={open}
                            onClose={this.handleClose}
                            TransitionComponent={Transition}>
                        <WrappedComponent {...this.props}/>
                    </Dialog>
                </Fragment>
            )
        }
    }

    Wrapper.displayName = `withOnRemount(${getDisplayName(WrappedComponent)})`

    return Wrapper;
}


export default withRemount;
