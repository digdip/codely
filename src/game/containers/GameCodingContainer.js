import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActions from '../actions/gameActions'
import * as commonActions from '../../common/actions/commonActions'
import * as grammar from  '../../const/grammar'

import TextualEditor from '../../common/components/TextualEditor'
import PropertiesList from '../components/GamePropertiesList'
import MethodsList from '../../common/components/MethodsList'

class GameCodingContainer extends Component {

    constructor(props) {
        super(props)
        this.onMethodBodyChange = this.onMethodBodyChange.bind(this)
    }

    onMethodBodyChange(value) {
        let entity = this.props.entities.get(this.props.selectedEntityId)
        this.props.actions.updateMethodBody(entity.get(grammar.ID), entity.get(grammar.SELECTED_METHOD), value)
    }

    render () {
        let entity = this.props.entities.get(this.props.selectedEntityId)
        return (
            <div className='codeContainer'>
                <PropertiesList data={entity} insertTextToMethod={this.props.actions.insertTextToMethod}/>
                <MethodsList data={entity}
                             addNewMethod={this.props.actions.addNewMethod}
                             selectMethod={this.props.actions.selectMethod}/>
                <TextualEditor
                    data={entity}
                    onChange={this.onMethodBodyChange}
                    runCode={this.props.actions.runMethod}
                    runNextLine={this.props.actions.runNextLine}
                    resetEntity={this.props.actions.resetEntity}
                    pauseEntity={this.props.actions.pauseEntity}
                    />
            </div>
        )
    }
}

function select(state) {
    return {
        entities: state.gameReducer.get(grammar.ENTITIES),
        selectedEntityId: state.gameReducer.get(grammar.SELECTED_ENTITY_ID)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, gameActions, commonActions), dispatch)
    }
}

export default connect(
    select,
    mapDispatchToProps
)(GameCodingContainer)