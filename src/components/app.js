import React from 'react'
import ReactDOM from 'react-dom'
import jetpack from 'fs-jetpack'
import { ChromePicker } from 'react-color'
import Submit from 'Submit.js'
import SVG from 'penguin-svg'

class App extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      color: "#282828"
    }

    this.handleChangeComplete = (color) => {
      this.setState({ color: color.hex });
    }

    this.handleFileDrop = this.handleFileDrop.bind(this)
  }

  handleFileDrop(ev) {
    let path = ev.dataTransfer.files[0].path
    let string = jetpack.read(path)

    // Change color
    let svg = new SVG(string)
    svg.fill(this.state.color)

    jetpack.write(path, svg.toString())
    ev.preventDefault()
  };

  render() {
    return (
      <div className="wrapper" onDrop={ this.handleFileDrop }>
        <ChromePicker
          color={ this.state.color }
          onChangeComplete={ this.handleChangeComplete }
        />
        <Submit/>
      </div>
    )
  }
}

export default App
