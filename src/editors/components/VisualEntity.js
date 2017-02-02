import React, { Component, PropTypes } from 'react'

class VisualizingEntity extends Component {

    render () {
        let properties = this.props.data.toJS()
        return (
            <svg width={properties.width}
                 height={properties.height}
                 style={{position: "absolute", top: properties.upDown + 'px', left : properties.leftRight + 'px'}}>

                    <rect width={properties.width}
                          height={properties.height}
                          style={{ fill: properties.color, strokeWidth: "2", stroke: "rgb(0,0,0)"}} />
            </svg>
        )
    }
}

export default VisualizingEntity
