import React, { Component, PropTypes } from 'react'
import * as appConstants from '../../const/appConstants'
import * as grammar from '../../const/grammar'

class VisualEntity extends Component {

    render () {
        let properties = this.props.data.toJS()
        let opacity = this.props.isGhost ? '0.3' : '1'

        return (
            <svg className='animate' width={properties[grammar.WIDTH] * appConstants.GRID_SIZE_PIXELS}
                 height={properties[grammar.HEIGHT] * appConstants.GRID_SIZE_PIXELS}
                 style={{position: "absolute", top: properties[grammar.Y] * appConstants.GRID_SIZE_PIXELS + 'px', left : properties[grammar.X] * appConstants.GRID_SIZE_PIXELS + 'px'}}>

                    <rect className='animate' width={properties[grammar.WIDTH] * appConstants.GRID_SIZE_PIXELS}
                          height={properties[grammar.HEIGHT] * appConstants.GRID_SIZE_PIXELS}
                          style={{ fill: 'RED', strokeWidth: "2", stroke: "rgb(0,0,0)", opacity : opacity}} />
            </svg>
        )
    }
}

export default VisualEntity