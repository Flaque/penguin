import React from 'react'
import ReactDOM from 'react-dom'
import jetpack from 'fs-jetpack'
import Submit from 'Submit.js'
import Drop from 'Drop.js'
import ColorPicker from 'ColorPicker.js'
import { isSVG } from 'file-utils.js'
import SVG from 'penguin-svg'


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
    for (let path in this.state.svgs) {
      jetpack.write(path, this.state.svgs[path].toString())
    }
  }

  handleFileDrop(ev) {
    let path = ev.dataTransfer.files[0].path
    ev.preventDefault()

    if (!isSVG(path)) throw "Path is not svg!"

    let string = jetpack.read(path)

    // Change color
    let svg = new SVG(string)
    svg.fill(this.state.color)

    this.setState((prevState) => {
      prevState.svgs[path] = svg
      return prevState
    })
  };

  render() {
    return (
      <div id="app">
        <Drop handleFileDrop={this.handleFileDrop}/>

        <div className="interaction-wrapper">
          <ColorPicker
              color={this.state.color}
              onColorChange={this.onColorChange}/>
          <Submit onClick={this.write}/>
        </div>
      </div>
    )
  }
}

export default App
