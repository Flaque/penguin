import React from 'react'
import ReactDOM from 'react-dom'
import jetpack from 'fs-jetpack'
import Submit from 'Submit.js'
import Drop from 'Drop.js'
import ColorPicker from 'ColorPicker.js'
import { isSVG, baseName } from 'file-utils.js'
import _ from 'lodash'
import SVG from 'penguin-svg.js'

const {dialog} = require('electron').remote

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      color: "#282828",
      svgs: {}
    }

    this.onColorChange = (event) => {
      this.setState({
        color: event.target.value
      }, () => {
        this.recolor()
      })
    }

    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.write = this.write.bind(this)
    this.recolor = this.recolor.bind(this)
  }

  recolor() {
    _.keys(this.state.svgs).forEach((key) => {
      this.setState((prevState) => {
        prevState.svgs[key].current = SVG.coloredMarkup(
            prevState.svgs[key].original, this.state.color)
      })
    })
  }

  write(ev) {
    if (_.isEmpty(this.state.svgs)) {
      throw "No SVG's to save!"
    }

    let outputFolders = dialog.showOpenDialog({
      properties: ['openDirectory', 'createDirectory', 'promptToCreate'],
      buttonLabel: "Export"
    })

    for (let path in this.state.svgs) {
      let outputPath = `${outputFolders[0]}/${baseName(path)}`
      jetpack.write(outputPath, this.state.svgs[path].current.outerHTML)
    }
  }

  handleFileDrop(ev) {

    // Handle each svg
    _.values(ev.dataTransfer.files).forEach(({path}) => {
      if (!isSVG(path)) throw "Path is not svg!"

      let string = jetpack.read(path)

      // Change color
      let svg = SVG.parse(string)
      let markup = SVG.coloredMarkup(svg, this.state.color)

      this.setState((prevState) => {
        prevState.svgs[path] = {original: svg, current: markup}
        return prevState
      })
    })

    this.recolor()

    ev.preventDefault()
  };

  render() {

    let displayItems = _.values(this.state.svgs).map(i => i.current)

    return (
      <div id="app">
        <Drop handleFileDrop={this.handleFileDrop} items={displayItems}/>

        <div className="interaction-wrapper">
          <ColorPicker
              color={this.state.color}
              onColorChange={this.onColorChange}/>
          <Submit onClick={this.write} disabled={_.isEmpty(this.state.svgs)}/>
        </div>
      </div>
    )
  }
}

export default App
