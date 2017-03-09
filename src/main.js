import jetpack from 'fs-jetpack'

import React from 'react'
import ReactDOM from 'react-dom'

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  let path = ev.dataTransfer.files[0].path
  ev.preventDefault()

  let data = jetpack.read(path)

  var parser = new DOMParser();
  var doc = parser.parseFromString(data, "application/xml");
  let svg = doc.getElementsByTagName("svg")[0]

  Array.prototype.forEach.call(svg.querySelectorAll("*"), (el) => {
    el.setAttribute('fill', 'green')
  })

  jetpack.write(path, svg.outerHTML)
}

ReactDOM.render(
  <h1> hi there :D </h1>,
  document.getElementById('root')
)
