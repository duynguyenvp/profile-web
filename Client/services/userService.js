import { randomId } from '../utils/string-utils'

var Subcribes = []
var user = {}
const subscribe = (f) => {
    Subcribes.push(f)
    return () => unsubscribe(Subcribes.filter(a => a != f));
}

const unsubscribe = (subcribes) => Subcribes = subcribes;

const onChange = () => {
    Subcribes.forEach(f => {
        f();
    })
};

const getState = () => user

const setState = (data) => {
    user = { ...user, ...data }
    onChange();
}

const resetState = () => {
    user = {}
    onChange();
}

const checkAdminRole = () => {
    if (!user || !user.userRoles) return false
    const isAdmin = user.userRoles.find(f => f.roleName == 'admin' || f.roleName == 'superadmin')
    if (isAdmin) {
        return true
    }
    return false
}

export {
    getState,
    setState,
    subscribe,
    unsubscribe,
    resetState,
    checkAdminRole
}