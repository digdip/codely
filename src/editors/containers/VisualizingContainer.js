import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Button} from 'react-mdl'
import VisualEntity from '../components/VisualEntity'
import * as editorsActions from '../actions/editorsActions'
import * as entityTypes from '../../const/entityTypes'

class VisualizingContainer extends Component {

    constructor(props) {
        super(props)
        this.playDemo = this.playDemo.bind(this)
    }

    componentDidMount() {
        this.props.actions.addNewEntity(entityTypes.SQUARE)
    }

    playDemo() {
        this.props.actions.playDemo('1')
    }

    render () {
        return (

            <div className='visualContainer'>
                <div className='toolbar'>
                    <Button style={{minWidth: '0', width: '50px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.playDemo}>
                        Play
                    </Button>
                </div>
                <div>
                    <VisualEntity data={this.props.demos.getIn(['1', 'properties'])} isGhost={true}/>
                    {this.props.entities.map((entity) =>
                        <VisualEntity data={entity.get('properties')}/>
                    )}
                </div>
            </div>
        )
    }
}


function select(state) {
    return {
        entities: state.editorsReducer.get('entities'),
        demos: state.editorsReducer.get('demos')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, editorsActions), dispatch)
    }
}

export default connect(
    select,
    mapDispatchToProps
)(VisualizingContainer)