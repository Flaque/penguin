import React from 'react'
import ReactDOM from 'react-dom'
import jetpack from 'fs-jetpack'
import Submit from 'Submit.js'
import Drop from 'Drop.js'
import ColorPicker from 'ColorPicker.js'
import { isSVG, baseName } from 'file-utils.js'
import _ from 'lodash'
import SVG from 'penguin-svg'

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
      })
    }

    this.handleFileDrop = this.handleFileDrop.bind(this)
    this.write = this.write.bind(this)
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
      jetpack.write(outputPath, this.state.svgs[path].toString())
    }
  }

  handleFileDrop(ev) {

    // Handle each svg
    _.values(ev.dataTransfer.files).forEach(({path}) => {
      if (!isSVG(path)) throw "Path is not svg!"

      let string = jetpack.read(path)

      // Change color
      let svg = new SVG(string)
      svg.fill(this.state.color)

      this.setState((prevState) => {
        prevState.svgs[path] = svg
        return prevState
      })
    })

    ev.preventDefault()
  };

  render() {

    return (
      <div id="app">
        <Drop handleFileDrop={this.handleFileDrop} items={this.state.svgs}/>

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
