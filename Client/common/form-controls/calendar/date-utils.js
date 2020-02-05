export const cloneDate = (date) => {
    if (!date) {
        return null
    }
    let result = new Date(date)
    if (result === 'Invalid Date') {
        throw "Invalid DateTime."
    }
    return result
}

export const iSLeapYear = (year) => ((year % 400 == 0) || (year % 4 == 0 && year % 100 != 0))

export const getMaxDayOfMonth = (date) => {
    const maxDayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    try {
        const fullYear = date.getFullYear()
        const month = date.getMonth()
        if (iSLeapYear(fullYear)) {
            if (month == 1) {
                return 29
            }
        }
        const maxDay = maxDayOfMonth[month]
        return maxDay

    } catch (error) {
        throw "Invalid DateTime."
    }
}

export const initDayItem = (name, value, month, className) => {
    return {
        name,
        value,
        month,
        className
    }
}
export const getListYears = () => {
    const currentYear = new Date().getFullYear()
    const result = []
    for (let y = 1950; y <= currentYear; y++) {
        result.push({
            name: `${y}`,
            value: `${y}`
        })
    }
    return result.reverse()
}

export const calculateArrayDay = (selectedDate) => {
    const leftContinuationDay = []
    const rightContinuationDay = []
    const maxDay = getMaxDayOfMonth(selectedDate)
    const currentIndex = selectedDate.getDate()
    const currentMonth = selectedDate.getMonth()
    // leftContinuationDay
    let leftDate = cloneDate(selectedDate)
    let leftIndex = currentIndex
    while (leftIndex > 0) {
        let className = 'item-day' + (leftIndex == currentIndex ? ' current-day' : '') + (leftIndex == selectedDate.getDate() ? ' selected' : '')
        let item = initDayItem(leftIndex, cloneDate(leftDate), currentMonth, className)
        leftContinuationDay.push(item)
        leftIndex--
        leftDate.setDate(leftIndex)
    }
    const tempLeftDayOfWeek = leftDate.getDay()
    const previousMaxDay = getMaxDayOfMonth(leftDate)
    let i = 0
    while (i <= tempLeftDayOfWeek) {
        let item = initDayItem(previousMaxDay - i, cloneDate(leftDate), currentMonth - 1, 'item-day extra-day')
        leftContinuationDay.push(item)
        i++
        leftDate.setDate(previousMaxDay - i)
    }
    // rightContinuationDay
    let rightDate = cloneDate(selectedDate)
    let rightIndex = currentIndex + 1
    rightDate.setDate(rightIndex)
    while (rightIndex <= maxDay) {
        let className = 'item-day' + (rightIndex == selectedDate.getDate() ? ' selected' : '')
        let item = initDayItem(rightIndex, cloneDate(rightDate), currentMonth, className)
        rightContinuationDay.push(item)
        rightIndex++
        rightDate.setDate(rightIndex)
    }
    let tempRightDayOfWeek = rightDate.getDay()
    let j = 1
    while (tempRightDayOfWeek <= 6) {
        let item = initDayItem(j, cloneDate(rightDate), currentMonth, 'item-day extra-day')
        rightContinuationDay.push(item)
        j++
        tempRightDayOfWeek++
        rightDate.setDate(j)
    }
    return [...leftContinuationDay.reverse(), ...rightContinuationDay]
}