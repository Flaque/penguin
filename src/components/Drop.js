import React from 'react'
import ReactDOM from 'react-dom'
import _ from 'lodash'

function Items(items) {
  return _.values(items).map((svg, index) => {
    return (
      <div key={index} className="item" dangerouslySetInnerHTML={{__html: svg.toString()}}>
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
        <div className="content">

          {(_.isEmpty(this.props.items)) ?
            <div className="empty-message">
              Drag and Drop <br/>
              SVG files here.
            </div>
            : Items(this.props.items)
          }
        </div>
      </div>
    )
  }
}

export default Drop
