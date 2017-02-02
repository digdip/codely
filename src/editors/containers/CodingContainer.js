import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as editorsActions from '../actions/editorsActions'

import TextualEditor from '../components/TextualEditor'
import PropertiesList from '../components/PropertiesList'
import MethodsList from '../components/MethodsList'

class CodingContainer extends Component {



    constructor(props) {
        super(props)
        this.onMethodBodyChange = this.onMethodBodyChange.bind(this)
    }

    onMethodBodyChange(value) {
        let entity = this.props.entities.get(this.props.selectedEntityId)
        this.props.actions.updateMethodBody(entity.get('id'), entity.get('selectedMethod'), value)
    }

    render () {
        let entity = this.props.entities.get(this.props.selectedEntityId)
        return (
            <div className='codeContainer'>
                <PropertiesList data={entity}/>
                <MethodsList data={entity}
                             addNewMethod={this.props.actions.addNewMethod}
                             selectMethod={this.props.actions.selectMethod}/>
                <TextualEditor
                    data={entity}
                    onChange={this.onMethodBodyChange}
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