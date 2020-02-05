import { randomId } from '../utils/string-utils'

var alertSubcribes = []
var alerts = []
const subscribe = (f) => {
    alertSubcribes.push(f)
    return alertSubcribes.filter(a => a != f);
}

const unsubscribe = (subscribes) => alertSubcribes = subscribes;

const onChange = () => {
    alertSubcribes.forEach(f => {
        f();
    })
};

const getAlerts = () => alerts

// { message: '', duration: 5000, type: '<error>|<warning>|<success>' }
const addAlert = (item) => {
    const { message, type, duration } = item
    let alert = { id: randomId() }
    alerts.push({...alert, message, type, duration})
    onChange();
}

const removeAlert = (id) => {
    alerts = alerts.filter(f => f.id != id)
    onChange();
}

export {
    getAlerts,
    addAlert,
    removeAlert,
    subscribe,
    unsubscribe
}