export const cloneDate = (date) => {
    if (!date) {
        return null
    }
    let result = new Date(date)
    if (result === 'Invalid Date') {
        return null
    }
    return result
}

export const dateToStringFormatCultureVi = (date) => {
    let newDate = cloneDate(date);
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        return newDate.toLocaleDateString('vi', options)
    } catch (error) {
        return ""
    }
}

export const datetimeToStringFormatCultureVi = (date) => {
    let newDate = cloneDate(date);
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
        let result = newDate.toLocaleDateString('vi', options)
        return result.split(',').reverse().join(' ').trim()
    } catch (error) {
        return ""
    }
}

export const dateToStringFormatNoDayCultureVi = (date) => {
    let newDate = cloneDate(date);
    try {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        let date = newDate.toLocaleDateString('vi', options)
        return date.substring(3)
    } catch (error) {
        return ""
    }
}

