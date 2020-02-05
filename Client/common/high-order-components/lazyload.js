import React, {Component} from 'react'
import {RComponent} from '../r-component.js'

export default function lazyLoad(getComponent, placeHolder) {
    return class AsyncComponent extends RComponent {
        constructor() {
            super();
            this.state = {Component: null};

            getComponent().then(component => {
                this.setState({Component: component.default || component})
            })
        }

        render() {
            const { Component } = this.state;
            if (Component) {
                return <Component {...this.props}/>
            }
            return placeHolder || null;
        }
    }
}