import { randomId } from '../utils/string-utils'

let Subcribes = []
let post = {}
const subscribePost = (f) => {
    Subcribes.push(f)
    return () => unsubscribePost(Subcribes.filter(a => a != f));
}

const unsubscribePost = (subscribes) => Subcribes = subscribes;

const onChange = () => {
    Subcribes.forEach(f => {
        f();
    })
};

const getPostState = () => post

const setPostState = (data) => {
    post = { ...post, ...data }
    onChange();
}

export {
    getPostState,
    setPostState,
    subscribePost,
    unsubscribePost
}