import React from "react";
import Login from "../../user/login/index.js";
import {getDisplayName} from './utils.js'
import {RComponent} from '../r-component.js'
import tokenService from '../../services/token-service.js'

const withAuthentication = function (WrappedComponent) {
    class Wrapper extends RComponent {
        constructor(props, context) {
            super(props, context)
            this.onMount(() => {
                this.onUnmount(tokenService.onChange(() => this.forceUpdate()))
            })
        }

        render() {
            if (tokenService.isExpired()) {
                return <Login hasAccount={true}/>
            }
            return <WrappedComponent {...this.props}/>
        }
    }

    Wrapper.displayName = `withAuthentication(${getDisplayName(WrappedComponent)})`

    return Wrapper;
}

export default withAuthentication;