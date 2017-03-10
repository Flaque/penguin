import React from 'react'
import ReactDOM from 'react-dom'
import { ChromePicker } from 'react-color'


class ColorPicker extends React.Component {

  render() {
    return (
      <div className="color-picker">
          <div className="combined-color">
            <div className="color-button"></div>
            <input type="text" className="right"/>
          </div>
      </div>
    )
  }
}

export default ColorPicker
