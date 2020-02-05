import { randomId } from '../utils/string-utils'
var Subcribes = []
var popups = []
const subscribe = (f) => {
    Subcribes.push(f)
    return Subcribes.filter(a => a != f);
}

const unsubscribe = (subscribes) => Subcribes = subscribes;

const onChange = () => {
    Subcribes.forEach(f => {
        f();
    })
};

const getPopups = () => popups

// {title: '', duration: -1, children: Component }
const addPopup = (item) => {
    let popup = { id: randomId() }
    popups.push({ ...popup, ...item })
    onChange();
    return popup.id
}

const removePopup = (id) => {
    popups = popups.filter(f => f.id != id)
    onChange();
}

export const PopupContext = React.createContext({
    popupId: '',
    onClose: () => { },
});

export {
    getPopups,
    addPopup,
    removePopup,
    subscribe,
    unsubscribe
}