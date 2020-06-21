import React from 'react'
import ReactDOM from 'react-dom'
import Resume from './Resume'
import StyleContext from 'isomorphic-style-loader/StyleContext'

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
}

ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
        <Resume />
    </StyleContext.Provider>,
    document.getElementById('app')
)