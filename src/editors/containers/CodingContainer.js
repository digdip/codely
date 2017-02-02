import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as editorsActions from '../actions/editorsActions'

import TextualEditor from '../components/TextualEditor'
import CodeDefinition from '../components/CodeDefinition'
import MethodsList from '../components/MethodsList'

class CodingContainer extends Component {
    render () {
        return (
            <div className='codeContainer'>
                <CodeDefinition selectedEntity={this.props.entities[this.props.selectedEntityId]}/>
                <MethodsList selectedEntity={this.props.entities[this.props.selectedEntityId]}
                             addNewMethod={this.props.actions.addNewMethod}/>
                <TextualEditor
                    value='hhhh'
                    />
            </div>
        )
    }
}

function select(state) {
    return {
        entities: state.editorsReducer.entities,
        selectedEntityId: state.editorsReducer.selectedEntityId
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
)(CodingContainer)