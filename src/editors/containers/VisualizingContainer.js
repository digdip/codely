import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import VisualEntity from '../components/VisualEntity'
import * as editorsActions from '../actions/editorsActions'
import * as entityTypes from '../../const/entityTypes'

class VisualizingContainer extends Component {
    componentDidMount() {
        this.props.actions.addNewEntity(entityTypes.SQUARE)
    }

    render () {
        return (
            <div className='visualContainer'>
                {Object.values(this.props.entities).map((entity) =>
                    <VisualEntity data={entity.properties}/>
                )}
            </div>
        )
    }
}


function select(state) {
    return {
        entities: state.editorsReducer.entities
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