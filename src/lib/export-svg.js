import dataurl from 'dataurl'
import jetpack from 'fs-jetpack'

// Constant tools
const canvas = document.getElementById('hidden-renderer')
const ctx = canvas.getContext('2d')
const DOMURL = window.URL || window.webkitURL || window
const domParser = new DOMParser()
const xmlSerializer = new XMLSerializer()

/**
 * Converts an svg string to a dom node
 */
function toSVGNode(svg) {
  return domParser.parseFromString(svg, "image/svg+xml")
}

/**
 * Converts svg to serialized XML string
 */
function toSVGData(svg) {
  return xmlSerializer.serializeToString(toSVGNode(svg))
}

/**
 * Converts svg to blob data
 */
function toSVGBlob(svg) {
  return new Blob([toSVGData(svg)], {type: 'image/svg+xml;charset=utf-8'});
}

/**
 * Converts svg to url
 */
function toSVGUrl(svg) {
  return DOMURL.createObjectURL(toSVGBlob(svg));
}

function drawSVG(svg, format, width, height) {
  return new Promise(function(resolve, reject) {

    canvas.width = width
    canvas.height = height

    let img = new Image(width, height);
    let url = toSVGUrl(svg);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, width, height)
      DOMURL.revokeObjectURL(url)

      let imgURI = canvas
        .toDataURL(`image/${format}`)
        .replace(`image/${format}`, `image/octet-stream`)

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      resolve(imgURI.replace(/^data:image\/\w+;base64,/, ""))
    }
    img.src = url

  })
}

export default {
  png(svg, output, width, height) {
    drawSVG(svg, "png", width, height)
      .then((imgURI) => {

        jetpack.file(output, {content: dataurl.parse(imgURI).data})
      })
  }
}
