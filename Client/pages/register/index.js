import React from 'react'
import ReactDOM from 'react-dom'
import Signup from './form-signup'
import '../../common-resources/root.scss'

ReactDOM.render(
  <Signup callback={() => {console.log("this is loginIn form.")}} />,
  document.getElementById('app')
)