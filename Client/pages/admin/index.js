import React, {useState} from 'react';
import { render } from 'react-dom';
import App from './App';
import './style.css'
import RESOURCE_VERSION from '../../../version'

const rootElement = document.getElementById('app');
render(<App />, rootElement);
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js?v=' + RESOURCE_VERSION).then(registration => {
            console.log('SW registered: ', registration);
        }).catch(registrationError => {
            console.log('SW registration failed: ', registrationError);
        });
    });
}
