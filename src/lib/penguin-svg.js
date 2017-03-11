

/**
 * Returns true if the element has a stroke or
 * the parent element has a stroke (which would trickle down)
 */
function hasDefinedStroke(el) {

  if (exists(el.parentNode.getAttribute('stroke'))) return true
  if (exists(el.getAttribute('stroke'))) return true
  if (el.style.stroke) return true

  return false
}

/**
 * Returns true if the element has a predefined "fill" attribute
 */
function hasDefinedFill(el) {
  return exists(el.getAttribute('fill'))
}

/**
 * Returns true if the property exists in SVG terms
 */
function exists(item) {
  return item !== "none" && item !== null
}

/**
 * Color's a path element via stroke or fill.
 * returns the elemnts
 */
function colorPath(el, color) {
  const defaultFill = el.getAttribute('fill')
  const defaultStroke = el.getAttribute('stroke')

  if (hasDefinedStroke(el)) {
    el.style.stroke = color // Highest authority
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

/**
 * Colors an element
 */
function colorElement(el, color) {
  colorPath(el)

  return el
}

/**
 * Public exported functions
 */
export default {
  parse(string) {
    const parser = new DOMParser()
    let doc = parser.parseFromString(string, "application/xml")
    return doc.getElementsByTagName("svg")[0]
  },

  coloredMarkup(svg, color) {

    // Create a clone to avoid effecting the object. (no side effects)
    const clone = this.parse(svg.outerHTML)

    Array.prototype.forEach.call(clone.querySelectorAll("*"), (el) => {
      // if (el.nodeName === "g") return false
      el = colorPath(el, color)
    })

    return clone
  }
}
