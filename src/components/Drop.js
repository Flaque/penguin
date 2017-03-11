import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

function Items(items) {
  return items.map((svg, index) => {
    return (
      <div key={index} className="item" dangerouslySetInnerHTML={{__html: svg.outerHTML}}>
      </div>
    )
  })
}

class Drop extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return (
      <div className="drop" onDrop={ this.props.handleFileDrop }>

          {(_.isEmpty(this.props.items)) ?
            <div className="empty-message">
              Drag and Drop <br/>
              SVG files here.
            </div>
            :  <div className="content">
              <button className="clear link-like" onClick={this.props.onClear}>Clear</button>
              {Items(this.props.items)}
            </div>
          }
      </div>
    )
  }
}

export default Drop
