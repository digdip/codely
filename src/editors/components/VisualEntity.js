import React, { Component, PropTypes } from 'react'
import * as appConstants from '../../const/appConstants'

class VisualizingEntity extends Component {

    render () {
        let properties = this.props.data.toJS()
        return (
            <svg className='animate' width={properties.width * appConstants.GRID_SIZE_PIXELS}
                 height={properties.height * appConstants.GRID_SIZE_PIXELS}
                 style={{position: "absolute", top: properties.upDown * appConstants.GRID_SIZE_PIXELS + 'px', left : properties.leftRight * appConstants.GRID_SIZE_PIXELS + 'px'}}>

                    <rect className='animate' width={properties.width * appConstants.GRID_SIZE_PIXELS}
                          height={properties.height * appConstants.GRID_SIZE_PIXELS}
                          style={{ fill: 'RED', strokeWidth: "2", stroke: "rgb(0,0,0)"}} />
            </svg>
        )
    }
}

export default VisualizingEntity
