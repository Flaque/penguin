import React from 'react'
import ReactDOM from 'react-dom'

class Submit extends React.Component {

  render() {

    return (
      <div className="submit">
          <button className="link-like" onClick={this.props.onClick} disabled={this.props.disabled}>Export</button>
      </div>
    )
  }
}

export default Submit
