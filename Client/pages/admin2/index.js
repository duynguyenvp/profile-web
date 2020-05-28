import React, {useState} from 'react';
import { render } from 'react-dom';
import App from './App';
import './style.css'

const rootElement = document.getElementById('app');
render(<App />, rootElement);