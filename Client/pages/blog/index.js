import React from 'react'
import ReactDOM from 'react-dom'
import App from '../home/App'
import Blog from './Blog'
import StyleContext from 'isomorphic-style-loader/StyleContext'

import { setPostState } from '../../services/postService'
setPostState(window.__INITIAL__DATA__)

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
}

ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
        <App>
            <Blog {...window.__INITIAL__DATA__} />
        </App>
    </StyleContext.Provider>,
    document.getElementById('app')
)