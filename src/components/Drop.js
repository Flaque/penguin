import React from 'react'
import ReactDOM from 'react-dom'

class Drop extends React.Component {

  render() {
    return (
      <div className="drop" onDrop={ this.props.handleFileDrop }>
        <div className="content">
        </div>
      </div>
    )
  }
}

export default Drop
