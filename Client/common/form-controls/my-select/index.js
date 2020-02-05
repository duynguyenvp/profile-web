import React, { Fragment } from 'react';
import { RComponent } from '../../r-component'
import withClickOutside from '../../high-order-components/with-onclick-outside.js'
import PropTypes from 'prop-types'
import './myselect.scss'
class MySelect extends RComponent {
    static propTypes = {
        selectedValues: PropTypes.array,
        listOptions: PropTypes.array,
        isFilter: PropTypes.bool,
        isMultiple: PropTypes.bool,
        placeholder: PropTypes.string,
    }
    static defaultProps = {
        selectedValues: [],
        listOptions: [],
        isFilter: false,
        isMultiple: false,
        placeholder: '-- Select --'
    }
    constructor(props) {
        super(props);
        const { selectedValues, listOptions, isFilter, placeholder } = props
        this.state = {
            isOpen: false,
            filter: '',
            selectedValues,
            listOptions: listOptions,
            isFilter,
            placeholder
        }
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedValues) !== JSON.stringify(state.selectedValues)) {
            const { selectedValues } = props
            return { selectedValues }
        }
        if (JSON.stringify(props.listOptions) !== JSON.stringify(state.listOptions) && !state.filter) {
            const { listOptions } = props
            return { listOptions }
        }
        if (JSON.stringify(props.isFilter) !== JSON.stringify(state.isFilter)) {
            const { isFilter } = props
            return { isFilter }
        }
        return null;
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.selectedValues) !== JSON.stringify(prevProps.selectedValues)
            || JSON.stringify(this.props.listOptions) !== JSON.stringify(prevProps.listOptions)
            || JSON.stringify(this.props.isFilter) !== JSON.stringify(prevProps.isFilter)) {
            const { selectedValues, listOptions, isFilter } = this.props
            this.setState({ selectedValues, listOptions, isFilter });
        }
    }

    toggle = () => {
        const { isOpen } = this.state
        let nextState = {
            isOpen: !isOpen
        }
        if (!isOpen) {
            const availableSpace = this.calculateAvailableSpace()
            nextState = { ...nextState, ...availableSpace }
        }
        this.setState(nextState)
    }
    close = () => {
        this.setState({
            isOpen: false,
            filter: ''
        })
    }

    handleClickOutside = () => {
        this.close();
    }

    calculateAvailableSpace = () => {
        try {
            var inputRect = this.refMySelect.getBoundingClientRect();
            var windowHeight = window.innerHeight;
        } catch (err) {
            return console.warn(err);
        }
        let topSpace = inputRect.top - 0;
        let bottomSpace = windowHeight - inputRect.bottom;
        let shouldBeUp = topSpace > bottomSpace;
        this.setState({ shouldBeUp })
    }

    handleSelectItem = (option) => {
        const { onChange, isMultiple } = this.props
        if (!isMultiple) {
            onChange([option.value])
            this.close()
        } else {
            const { selectedValues } = this.state
            const isExisted = selectedValues.findIndex(f => f == option.value) != -1
            if (isExisted) {
                let newSelected = selectedValues.filter(f => f != option.value)
                onChange(newSelected)
            } else {
                let newSelected = [...selectedValues, option.value]
                var mySet = new Set([...newSelected]);
                onChange([...mySet])
            }
        }
    }

    handleRemoveItem = value => {
        const { onChange } = this.props
        const { selectedValues } = this.state
        let newSelected = selectedValues.filter(f => f != value)
        onChange(newSelected)
    }

    renderSelectedOption = () => {
        const { isMultiple } = this.props
        const { selectedValues, listOptions, placeholder } = this.state
        if (selectedValues && selectedValues.length) {
            let selected = ''
            if (isMultiple) {
                selected = []
                selected = selectedValues && selectedValues.map((value, index) => {
                    const option = listOptions.find(f => f.value == value)
                    const optionName = option && option.name || ''
                    return (
                        <div className="multiple-option-selected" key={index}>
                            <span>{optionName}</span>
                            <span className="multiple-option-selected-icon" onClick={e => {
                                e.preventDefault()
                                e.stopPropagation()
                                this.handleRemoveItem(value)
                            }}></span>
                        </div>
                    )
                })
            } else {
                const selectedId = selectedValues[0]
                const selectedOption = listOptions.find(f => f.value == selectedId)
                selected = selectedOption && selectedOption.name || ''
            }
            return <span className="myselect-option-selected">
                {selected}
            </span>
        }
        if (placeholder) {
            return <span className="myselect-place-holder">{placeholder}</span>
        }
        return <span className="myselect-option-selected"></span>
    }

    handleFilter = value => {
        const { listOptions } = this.state
        const newOptions = listOptions.filter(f => f.name.indexOf(value) != -1)
        this.setState({
            filter: value,
            listOptions: newOptions
        })
    }

    render() {
        const { isOpen, selectedValues, listOptions, isFilter, shouldBeUp, filter } = this.state
        const { isMultiple } = this.props
        return (
            <div className="myselect-container" ref={instance => this.refMySelect = instance}>
                <div className={`myselect-selected ${isMultiple ? 'multiple' : ''}`} onClick={e => {
                    e.preventDefault()
                    e.stopPropagation()
                    this.toggle()
                }}>
                    {
                        this.renderSelectedOption()
                    }
                    <span className={`myselect-icon ${isOpen ? 'open' : ''}`}>&#9660;</span>
                </div>
                <div className={`myselect-options ${isOpen ? 'open' : 'closed'} ${shouldBeUp ? 'up' : 'down'}`}
                    ref={instance => this.refMySelectOptions = instance}>
                    {isFilter && <input type="text"
                        className="myselect-filter"
                        placeholder="TÌm kiếm ..."
                        value={filter}
                        onChange={e => { this.handleFilter(e.target.value) }} />}
                    {
                        listOptions && listOptions.map(
                            (option, index) => {
                                return <div key={index}
                                    className={`option ${selectedValues.findIndex(f => f == option.value) == -1 ? '' : 'active'}`}
                                    onClick={e => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        this.handleSelectItem(option)
                                    }}>
                                    {option.name}
                                </div>
                            }
                        )
                    }
                </div>
            </div>
        );
    }
}

export default withClickOutside(MySelect);