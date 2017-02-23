import React, { Component, PropTypes } from 'react'
import * as appConstants from '../../const/appConstants'
import * as grammar from '../../const/grammar'

class VisualEntity extends Component {

    constructor(props) {
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        if (this.props.onClick) {
            this.props.onClick(this.props.data.get(grammar.ID))
        }
    }

    render () {
        let properties = this.props.data.get(grammar.PROPERTIES).toJS()
        let isVisible = properties[grammar.IS_VISIBLE]
        let opacity = this.props.isGhost ? '0.3' : '1'
        let height = properties[grammar.HEIGHT] * appConstants.GRID_SIZE_PIXELS + (this.props.isSelected ? 2 : 0)
        let width = properties[grammar.WIDTH] * appConstants.GRID_SIZE_PIXELS + (this.props.isSelected ? 2 : 0)
        return (
        isVisible ?
            <svg className='animate' width={width} onClick={this.onClick}
                 height={height}
                 style={{position: "absolute", top: properties[grammar.Y] * appConstants.GRID_SIZE_PIXELS + 'px', left : properties[grammar.X] * appConstants.GRID_SIZE_PIXELS + 'px'}}>

                    <rect className='animate' width={width}
                          height={height}
                          style={{ fill: properties[grammar.COLOR], strokeWidth: this.props.isSelected ? 4 : 2, stroke: "rgb(0,0,0)", opacity : opacity}} />
            </svg>
            : <div/>
        )
    }
}

export default VisualEntity
