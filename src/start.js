import React from 'react'
import ReactDOM from 'react-dom'
import App from 'app.js'

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

ReactDOM.render(
  <App />,
  document.getElementById('root')
)
