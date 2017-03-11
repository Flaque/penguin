function hasDefinedStroke(el) {

  if (exists(el.parentNode.getAttribute('stroke'))) return true
  if (exists(el.getAttribute('stroke'))) return true

  return false
}

function hasDefinedFill(el) {
  return exists(el.getAttribute('stroke'))
}

function exists(item) {
  return item !== "none" && item !== null
}

function colorPath(el, color) {
  const defaultFill = el.getAttribute('fill')
  const defaultStroke = el.getAttribute('stroke')

  if (hasDefinedStroke(el)) {
    el.setAttribute('stroke', color) // TODO Check if parent has stroke
    return
  }

  // If nothing's set, use the fill.
  if (!exists(defaultFill) && !exists(defaultStroke)) {
    el.setAttribute('fill', color)
    return
  } else if (exists(defaultFill)) {
    el.setAttribute('fill', color)
  }

  return el
}

export default class {

  constructor(string) {
    const parser = new DOMParser()
    let doc = parser.parseFromString(string, "application/xml")
    this._svg = doc.getElementsByTagName("svg")[0]
  }

  /**
   * Fills the svg to a color
   */
  fill(color) {
    Array.prototype.forEach.call(this._svg.querySelectorAll("*"), (el) => {

      // Don't effect group nodes
      if (el.nodeName === "g") return false

      if (el.nodeName === "path" || el.nodeName === "line") {
        el = colorPath(el, color)
      } else {
        if (hasDefinedFill(el)) {
          el.setAttribute('fill', color)
        } else {
          el.setAttribute('stroke', color)
        }
      }
    })
    return this
  }

  /**
   * Returns the svg as a string
   */
  toString() {
    return this._svg.outerHTML
  }
}
