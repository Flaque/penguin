import React from 'react'
import ReactDOM from 'react-dom'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { ChromePicker } from 'react-color'
import './ColorPicker.scss'


function clicker(self) {
  if (!self.state.clickerOpen) return ""

  return (
    <div className="picker-wrapper" onClick={self.toggle}>
      <ChromePicker color={self.props.color} key="chromepicker"
        onChange={self.onColorPickerChange}/>
    </div>
  )
}

class ColorPicker extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      clickerOpen: false
    }

    this.onColorPickerChange = (color) => {
      this.props.onColorChange(color.hex)
    }

    this.onColorTextChange = (event) => {
      this.props.onColorChange(event.target.value)
    }

    this.toggle = (event) => {

      // Only toggle off when clicking outside
      if (event.target.className != "picker-wrapper"
        && this.state.clickerOpen) {
        return
      }

      this.setState((prevState) => {
        prevState.clickerOpen = !prevState.clickerOpen
        return prevState
      })
    }
  }

  render() {
    const style = {
      background: this.props.color
    }

    return (
      <div className="color-picker">
        <ReactCSSTransitionGroup
          transitionName="left"
          transitionEnterTimeout={500}
          transitionLeaveTimeout={300}>
          {clicker(this)}
        </ReactCSSTransitionGroup>
          <div className="combined-color">
            <button aria-label="Open Color Picker"
              className="color-button" style={style}
              onClick={this.toggle}>
            </button>
            <input type="text"
              value={this.props.color}
              className="right"
              onChange={this.onColorTextChange}/>
          </div>
      </div>
    )
  }
}

export default ColorPicker
