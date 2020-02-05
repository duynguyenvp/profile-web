import React from 'react'
import PropTypes from 'prop-types'
import {RComponent} from './r-component.js'

export default class StepsWizard extends RComponent {

    static propTypes = {
        steps: PropTypes.array.isRequired,
        initStep: PropTypes.number,
    }

    static defaultProps = {
        initStep: 0,
        steps: []
    }

    state = {
        activeStep: this.props.initStep
    }

    onBack = () => {
        const {activeStep} = this.state;
        if (activeStep > 0) {
            this.setState({activeStep: activeStep - 1});
        }
    }

    onNext = () => {
        const {steps} = this.props;
        if (!steps || steps.length == 0) return;
        const {activeStep} = this.state;
        if (steps[activeStep + 1]) {
            this.setState({activeStep: activeStep + 1});
        }
    }

    render() {
        const {steps} = this.props;
        if (!steps || steps.length == 0) return null;

        const {activeStep} = this.state;
        const currentStep = steps[activeStep];
        const nextStep = steps[activeStep + 1];

        console.log(currentStep)

        return currentStep.render({onBack: this.onBack, onNext: this.onNext});
    }
}