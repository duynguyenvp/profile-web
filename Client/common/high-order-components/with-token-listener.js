import React, {Fragment} from "react";
import {RComponent} from '../r-component.js'
import {getDisplayName} from './utils.js'
import TokenExpiredPopup from "../../user/login/token-expired-popup";

const withTokenListener = function (WrappedComponent) {
    class Wrapper extends RComponent {
        render() {
            return (
                <Fragment>
                    <WrappedComponent {...this.props}/>
                    <TokenExpiredPopup/>
                </Fragment>
            )
        }
    }

    Wrapper.displayName = `withTokenListener(${getDisplayName(WrappedComponent)})`

    return Wrapper;
}

export default withTokenListener;