import React, {Component} from 'react'
import RandomUtil from '../../utils/random-util.js'
import {getDisplayName} from './utils.js'

const withRemount = function (WrappedComponent) {
    class Wrapper extends Component {
        constructor(props, context) {
            super(props, context)
            this.state = {key: RandomUtil.randomId()}
            this.onRemount = this.onRemount.bind(this)
        }

        onRemount() {
            this.setState({key: RandomUtil.randomId()})
        }

        render() {
            return <WrappedComponent key={this.state.key} onRemount={this.onRemount} {...this.props}/>
        }
    }

    Wrapper.displayName = `withOnRemount(${getDisplayName(WrappedComponent)})`

    return Wrapper;
}


export default withRemount;