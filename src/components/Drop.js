import React from 'react'
import ReactDOM from 'react-dom'

class Drop extends React.Component {

  handleFileDrop(ev) {
    let path = ev.dataTransfer.files[0].path
  }

  render() {
    return (
      <div className="drop" onDrop={ this.handleFileDrop }>
        <div className="content">
        </div>
      </div>
    )
  }
}

export default Drop
