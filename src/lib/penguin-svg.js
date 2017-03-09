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
      el.setAttribute('fill', color)
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
