import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as editorsActions from '../actions/editorsActions'

import TextualEditor from '../components/TextualEditor'
import PropertiesList from '../components/PropertiesList'
import MethodsList from '../components/MethodsList'

class CodingContainer extends Component {
    render () {
        return (
            <div className='codeContainer'>
                <PropertiesList data={this.props.entities.get(this.props.selectedEntityId)}/>
                <MethodsList data={this.props.entities.get(this.props.selectedEntityId)}
                             addNewMethod={this.props.actions.addNewMethod}
                             selectMethod={this.props.actions.selectMethod}/>
                <TextualEditor
                    value='hhhh'
                    />
            </div>
        )
    }
}

function select(state) {
    return {
        entities: state.editorsReducer.get('entities'),
        selectedEntityId: state.editorsReducer.get('selectedEntityId')
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