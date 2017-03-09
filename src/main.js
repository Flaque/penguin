import jetpack from 'fs-jetpack'

document.ondragover = document.ondrop = (ev) => {
  ev.preventDefault()
}

document.body.ondrop = (ev) => {
  let path = ev.dataTransfer.files[0].path
  ev.preventDefault()

  let data = jetpack.read(path)

  console.log(data, path)

  var parser = new DOMParser();
  var doc = parser.parseFromString(data, "application/xml");
  let svg = doc.getElementsByTagName("svg")[0]

  Array.prototype.forEach.call(svg.querySelectorAll("*"), (el) => {
    el.setAttribute('fill', 'green')
  })

  jetpack.write(path, svg.outerHTML)
}
