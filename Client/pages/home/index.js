import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import Home from './Home'
import RESOURCE_VERSION from '../../../version'
import ReactGA from 'react-ga';
import { createBrowserHistory } from 'history';
import StyleContext from 'isomorphic-style-loader/StyleContext'

const history = createBrowserHistory();
const trackingId = "UA-151257939-2";
ReactGA.initialize(trackingId);
history.listen(location => {
    ReactGA.set({ page: location.pathname });
    ReactGA.pageview(location.pathname);
});


const insertCss = (...styles) => {
    const removeCss = styles.map(style => style._insertCss())
    return () => removeCss.forEach(dispose => dispose())
}

ReactDOM.hydrate(
    <StyleContext.Provider value={{ insertCss }}>
        <App>
            <Home />
        </App>
    </StyleContext.Provider>
    ,
    document.getElementById('app')
)

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js?v=' + RESOURCE_VERSION).then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}