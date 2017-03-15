import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app.js'
import {webFrame} from 'electron'

webFrame.setVisualZoomLevelLimits(1, 1)


document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
