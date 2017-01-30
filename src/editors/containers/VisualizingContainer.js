import React, { Component, PropTypes } from 'react'
import VisualizingEntity from '../components/VisualEntity'

class VisualizingContainer extends Component {
    render () {
        return (
            <div className='visualContainer'>
                <VisualizingEntity/>
            </div>
        )
    }
}

export default VisualizingContainer