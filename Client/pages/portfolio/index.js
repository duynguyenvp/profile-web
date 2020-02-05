import React from 'react'
import ReactDOM from 'react-dom'
import Resume from './Resume'
import ResumePrint from './ResumePrint'
import StyleContext from 'isomorphic-style-loader/StyleContext'

const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
}

ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
        {window.__PRINT__ ? <ResumePrint /> : <Resume />}
    </StyleContext.Provider>,
    document.getElementById('app')
)