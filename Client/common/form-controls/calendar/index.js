import React from 'react';
import { RComponent } from '../../r-component'
import withClickOutside from '../../high-order-components/with-onclick-outside.js'
import './style.scss'

import IconDate from './icons/icon-date.js'
import IconUp from './icons/icon-up'
import IconDown from './icons/icon-down'
import IconNext from './icons/icon-next'
import IconPrevious from './icons/icon-previous'
import IconTime from './icons/icon-time';
import IconCurrent from './icons/icon-current';
import Select from '../my-select'
import PropTypes from 'prop-types'

import { calculateArrayDay, getListYears } from './date-utils'
import getLanguage from './languages'

const weekTitle = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

class Calendar extends RComponent {
    static propTypes = {
        callback: PropTypes.func,
        defaultValue: PropTypes.object,
        isDateOnly: PropTypes.bool
    }
    static defaultProps = {
        callback: () => { },
        defaultValue: new Date(),
        isDateOnly: true
    }

    constructor(props) {
        super(props);

        this.state = {
            days: [],
            selectedDate: props.defaultValue,
            displayCalendarPanel: false,
            isActiveTimePicker: false,
            language: 'vi'
        }

        this.onMount(() => {
            this.initDays()
        })
    }

    calculateAvailableSpace = () => {
        try {
            var inputRect = this.refCalendar.getBoundingClientRect();
            var windowHeight = window.innerHeight;
        } catch (err) {
            console.warn(err);
            return { shouldBeUp: false }
        }
        let topSpace = inputRect.top - 0;
        let bottomSpace = windowHeight - inputRect.bottom;
        let shouldBeUp = topSpace > bottomSpace;
        this.setState({ shouldBeUp })
    }

    initDays = () => {
        if (!this.mounted) return
        const { selectedDate } = this.state
        const days = calculateArrayDay(selectedDate)
        this.setState({ days, selectedDate })
    }

    handleClickOutside = () => {
        this.setState({ displayCalendarPanel: false })
    }

    prev = () => {
        const newSelectedDate = new Date(this.state.selectedDate)
        const month = newSelectedDate.getMonth()
        this.setState({
            selectedDate: new Date(newSelectedDate.setMonth(month - 1))
        }, () => {
            this.initDays()
        })
    }

    next = () => {
        const newSelectedDate = new Date(this.state.selectedDate)
        const month = newSelectedDate.getMonth()
        this.setState({
            selectedDate: new Date(newSelectedDate.setMonth(month + 1))
        }, () => {
            this.initDays()
        })
    }

    onSelectDate = (date) => {
        this.props.callback(date)
        this.setState({
            selectedDate: date,
            displayCalendarPanel: false
        }, () => {
            this.initDays()
        })
    }

    toggleTimePicker = () => {
        const { isActiveTimePicker } = this.state
        this.setState({ isActiveTimePicker: !isActiveTimePicker })
    }

    handleTimePickerHour = value => {
        const { selectedDate } = this.state
        let hour = isNaN(value) ? 0 : Number(value)
        hour = hour < 0 ? 0 : hour
        hour = hour > 23 ? 23 : hour
        const newDate = new Date(selectedDate)
        newDate.setHours(hour)
        this.props.callback(newDate)
        this.setState({ selectedDate: newDate }, () => {
            this.refHour.value = hour
        })
    }

    upHour = () => {
        this.handleTimePickerHour(Number(this.refHour.value) + 1)
    }
    downHour = () => {
        this.handleTimePickerHour(Number(this.refHour.value) - 1)
    }

    handleTimePickerMinute = value => {
        const { selectedDate } = this.state
        let minute = isNaN(value) ? 0 : Number(value)
        minute = minute < 0 ? 0 : minute
        minute = minute > 59 ? 59 : minute
        const newDate = new Date(selectedDate)
        newDate.setMinutes(minute)
        this.props.callback(newDate)
        this.setState({ selectedDate: newDate }, () => {
            this.refMinute.value = minute
        })
    }

    upMinute = () => {
        this.handleTimePickerMinute(Number(this.refMinute.value) + 1)
    }
    downMinute = () => {
        this.handleTimePickerMinute(Number(this.refMinute.value) - 1)
    }

    handleChangeYear = year => {
        const { selectedDate } = this.state
        const newDate = new Date(selectedDate)
        newDate.setFullYear(year)
        this.props.callback(newDate)
        this.setState({ selectedDate: newDate }, () => {
            this.initDays()
        })
    }

    handleChangeMonth = month => {
        const { selectedDate } = this.state
        const newDate = new Date(selectedDate)
        newDate.setMonth(month)
        this.props.callback(newDate)
        this.setState({ selectedDate: newDate }, () => {
            this.initDays()
        })
    }
    
    setCurrentDate = () => {
        const newDate = new Date()
        this.props.callback(newDate)
        this.setState({ selectedDate: newDate }, () => {
            this.initDays()
        })
    }

    toggleCalendar = () => {
        const { displayCalendarPanel } = this.state
        let nextState = {
            displayCalendarPanel: !displayCalendarPanel
        }
        if (!displayCalendarPanel) {
            const availableSpace = this.calculateAvailableSpace();
            nextState = { ...nextState, ...availableSpace }
        }
        this.setState(nextState)
    }

    render() {
        const { isDateOnly } = this.props
        const { days, selectedDate, displayCalendarPanel, isActiveTimePicker, language, shouldBeUp } = this.state
        let options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        options = isDateOnly ? options : { ...options, hour: '2-digit', minute: '2-digit' }
        const languages = getLanguage(language)
        return (
            <div className="duy-deptrai-calendar-container" ref={instance => this.refCalendar = instance}>
                <div className="input-date">
                    <div className="icon">
                        <IconDate />
                    </div>
                    <div className="display-info" onClick={this.toggleCalendar}>
                        {
                            selectedDate.toLocaleDateString(language, options).replace(' ', '').split(',').reverse().join(' ')
                        }
                    </div>
                </div>
                <div className={`calendar ${displayCalendarPanel ? 'show' : 'hide'} ${shouldBeUp ? 'up' : 'down'}`}>
                    <div className="header">
                        <div className="prev" onClick={this.prev}>
                            <IconPrevious />
                        </div>
                        <div className="info">
                            <div style={{ width: 90 }}>
                                <Select listOptions={languages.months.map((item, index) => ({ name: item, value: `${index}` }))}
                                    placeholder="--Months--"
                                    selectedValues={[`${selectedDate.getMonth()}`]}
                                    onChange={month => { this.handleChangeMonth(month) }} />
                            </div>
                            <div style={{ width: 70 }}>
                                <Select listOptions={getListYears()}
                                    placeholder="--Years--"
                                    selectedValues={[`${selectedDate.getFullYear()}`]}
                                    onChange={year => { this.handleChangeYear(year) }} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center' }} onClick={this.setCurrentDate}>
                                <IconCurrent />
                            </div>
                        </div>
                        <div className="next" onClick={this.next}>
                            <IconNext />
                        </div>
                    </div>
                    <div className="body-days" style={{ paddingBottom: !isDateOnly && !isActiveTimePicker ? 40 : 0 }}>
                        {
                            weekTitle.map((item, index) => (
                                <span key={index} className="item-day-of-week-title">{item}</span>
                            ))
                        }
                        {
                            days.map((item, index) => (
                                <span key={index} className={item.className}
                                    onClick={() => { this.onSelectDate(item.value) }}>{item.name}</span>
                            ))
                        }
                    </div>
                    {
                        !isDateOnly &&
                        <div className={`calendar-timepicker-container ${isActiveTimePicker ? 'active' : 'inactive'}`}>
                            <div className="calendar-timepicker-icon" onClick={this.toggleTimePicker}>
                                <IconTime />
                            </div>
                            <div className="calendar-timepicker-wrapper">
                                <div className="box-hour">
                                    <div onClick={this.upHour}>
                                        <IconUp />
                                    </div>
                                    <input type="number"
                                        ref={instance => this.refHour = instance}
                                        className="timepicker-input"
                                        value={selectedDate.getHours()}
                                        onChange={e => { this.handleTimePickerHour(e.target.value) }} />
                                    <div onClick={this.downHour}>
                                        <IconDown />
                                    </div>
                                </div>
                                <span>:</span>
                                <div className="box-minute">
                                    <div onClick={this.upMinute}>
                                        <IconUp />
                                    </div>
                                    <input type="number"
                                        ref={instance => this.refMinute = instance}
                                        className="timepicker-input"
                                        value={selectedDate.getMinutes()}
                                        onChange={e => { this.handleTimePickerMinute(e.target.value) }} />
                                    <div onClick={this.downMinute}>
                                        <IconDown />
                                    </div>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        );
    }
}

export default withClickOutside(Calendar);