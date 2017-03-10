import React from 'react'
import ReactDOM from 'react-dom'
import { ChromePicker } from 'react-color'

class ColorPicker extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const style = {
      background: this.props.color
    }

    return (
      <div className="color-picker">
          <div className="combined-color">
            <div className="color-button" style={style}></div>
            <input type="text"
              value={this.props.color}
              className="right"
              onChange={this.props.onColorChange}/>
          </div>
      </div>
    )
  }
}

export default ColorPicker
