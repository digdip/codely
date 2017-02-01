import React, { Component, PropTypes } from 'react'

class VisualizingEntity extends Component {

    render () {
        return (
            <svg width={this.props.data.width}
                 height={this.props.data.height}
                 style={{position: "absolute", top: this.props.data.upDown + 'px', left : this.props.data.leftRight + 'px'}}>

                    <rect width={this.props.data.width}
                          height={this.props.data.height}
                          style={{ fill: this.props.data.color, strokeWidth: "2", stroke: "rgb(0,0,0)"}} />
            </svg>
        )
    }
}

export default VisualizingEntity
