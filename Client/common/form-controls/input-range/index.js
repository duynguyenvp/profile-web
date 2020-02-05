import React, { Component } from 'react';
import './style.scss'
import PropTypes from 'prop-types'

const calculatePositionOutput = (controlVal, min, range) => {
    const position = ((controlVal - min) / range) * 100;
    const positionOffset = Math.round(20 * position / 100) - (20 / 2);
    return 'calc(' + position + '% - ' + positionOffset + 'px)';
}
class InputRange extends Component {
    static propTypes = {
        min: PropTypes.number,
        max: PropTypes.number,
        step: PropTypes.number,
        defaultValue: PropTypes.number,
        onChange: PropTypes.func,
        ShowBubble: PropTypes.bool
    }
    static defaultProps = {
        min: 0,
        max: 100,
        step: 1,
        defaultValue: 50,
        onChange: () => { },
        ShowBubble: true
    }

    constructor(props) {
        super(props);
        const { min, max, defaultValue } = props
        this.state = {
            value: defaultValue || 0,
            left: calculatePositionOutput(defaultValue || 0, min, max - min)
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (props.defaultValue !== state.defaultValue) {
            const { defaultValue } = props
            return { defaultValue }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (this.props.defaultValue !== prevProps.defaultValue) {
            const { defaultValue } = this.props
            this.setState({ value: defaultValue });
        }
    }

    onChange = (e) => {
        const { min, max, onChange } = this.props
        const range = max - min;
        const controlVal = isNaN(e.target.value) ? 50 : Number(e.target.value)

        this.setState({
            value: controlVal,
            left: calculatePositionOutput(controlVal, min, range)
        }, () => {
            onChange(controlVal)
        })
    }
    render() {
        const { min, max, step, ShowBubble } = this.props
        const { value, left } = this.state
        return (
            <div className="range-control">
                <input id="inputRange" type="range" min={min} max={max} step={step}
                    value={value}
                    onChange={this.onChange} />
                {ShowBubble && <output style={{ left: left }} name="rangeVal">{value}</output>}
            </div>
        );
    }
}

export default InputRange;