import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as gameActions from '../actions/gameActions'
import * as appConstants from  '../../const/appConstants'
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
        this.props.actions.updateMethodBody(this.props.entity.get(grammar.ID), this.props.entity.get(grammar.SELECTED_METHOD), value)
    }

    render () {
        return (
            <div className='codeContainer'>
                <PropertiesList data={this.props.entity} insertTextToMethod={this.props.actions.insertTextToMethod}/>
                <MethodsList data={this.props.entity}
                             addNewMethod={this.props.actions.addNewMethod}
                             selectMethod={this.props.actions.selectMethod}/>
                <TextualEditor
                    data={this.props.entity}
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
        entity: state.gameReducer.get(grammar.SELECTED_ENTITY_ROLE) === appConstants.EntityRole.MAIN_CHARACTER ? state.gameReducer.get(grammar.MAIN_CHARACTER) : state.gameReducer.get(grammar.ENEMY)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, gameActions), dispatch)
    }
}

export default connect(
    select,
    mapDispatchToProps
)(GameCodingContainer)