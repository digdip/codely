import React, { Component, PropTypes } from 'react'

class VisualizingEntity extends Component {

    render () {
        return (
            <svg width="50" height="50" style={{position: "absolute", top: '200px', left : '150px'}}>
                <rect width="50" height="50" style={{ fill: "rgb(0,0,255)", strokeWidth: "2", stroke: "rgb(0,0,0)"}} />
            </svg>
        )
    }
}

export default VisualizingEntity
