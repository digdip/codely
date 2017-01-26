import React, { Component, PropTypes } from 'react'
import VisualizingEntity from '../components/VisualEntity'

class VisualizingContainer extends Component {
    render () {
        return (
            <div style={{width : '100%',height: '60%', borderBottom: '1px solid black', display : 'inline-block'}}>
                <VisualizingEntity/>
            </div>
        )
    }
}

export default VisualizingContainer