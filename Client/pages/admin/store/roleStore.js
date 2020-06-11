import { useEffect, useState, useLayoutEffect } from 'react';

let registeredObjects = []
let roles = []
const subscribe = (f) => {
    registeredObjects.push(f)
    return () => unsubscribe(registeredObjects.filter(a => a != f));
}

const unsubscribe = (subcribes) => subcribes = subcribes;

const onChange = () => {
    registeredObjects.forEach(f => {
        f();
    })
};

export const getRoles = () => roles

export const setRoles = (data) => {
    roles = data
    onChange()
}

export const addOrUpdateRole = (role) => {
    let isExist = false
    roles = roles.map(item => {
        if (item.id == role.id) {
            isExist = true
            return role
        }
        return item
    })
    if (!isExist) {
        roles = [...roles, role]
    }
    onChange()
}

export const removeRole = (id) => {
    roles = roles.filter(f => f.id != id)
    onChange()
}

export const resetRoles = () => {
    roles.length = 0
    onChange();
}

export function useRoleStore() {
    const [value, setValue] = useState(getRoles());
    useLayoutEffect(() => {
        let isMounted = true
        const unsubcribes = subscribe(() => {
            if (!isMounted) return
            setValue(getRoles());
        })
        return () => {
            isMounted = false
            unsubcribes()
        };
    }, []);

    return value;
}