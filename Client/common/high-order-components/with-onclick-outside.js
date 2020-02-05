import React, {Component} from 'react'
import {findDOMNode} from 'react-dom'
import {getDisplayName} from '../../common/high-order-components/utils.js'

const withClickOutside = function (WrappedComponent) {
    class Wrapper extends Component {
        constructor(props, context) {
            super(props, context)
            this.handleClickOutside = this.handleClickOutside.bind(this);
        }

        componentDidMount() {
            document.addEventListener('mousedown', this.handleClickOutside);
        }

        componentWillUnmount() {
            document.removeEventListener('mousedown', this.handleClickOutside);
        }

        handleClickOutside(event) {
            if (!this.wrappedComponent) return;
            if (typeof this.wrappedComponent.handleClickOutside != 'function') return;
            var wrapper = findDOMNode(this.wrappedComponent);
            if (wrapper && !wrapper.contains(event.target)) {
                this.wrappedComponent.handleClickOutside.bind(this.wrappedComponent)();
            }
        }

        render() {
            return <WrappedComponent ref={c => this.wrappedComponent = c}  {...this.props}/>
        }
    }

    Wrapper.displayName = `withOnClickOutside(${getDisplayName(WrappedComponent)})`

    return Wrapper;
}


export default withClickOutside;