import { randomId } from '../utils/string-utils'

let Subcribes = []
let comment = {
    "postId": -1,
    "like": 0,
    "dislike": 0,
    "isLikeReact": true,
    "isDislikeReact": true,
    "commentLikeDislikeStat": [
    ]
}
const subscribeComment = (f) => {
    Subcribes.push(f)
    return () =>  unsubscribeComment(Subcribes.filter(a => a != f));
}

const unsubscribeComment = (subscribes) => Subcribes = subscribes;

const onChange = () => {
    Subcribes.forEach(f => {
        f();
    })
};

const getCommentState = () => comment

const setCommentState = (data) => {
    comment = { ...comment, ...data }
    onChange();
}

const removeCommentState = () => {
    comment = {}
    onChange();
}

export {
    getCommentState,
    setCommentState,
    subscribeComment,
    unsubscribeComment,
    removeCommentState
}