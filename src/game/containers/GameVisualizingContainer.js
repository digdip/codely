import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '../../infra-components/Button'
import VisualEntity from '../../common/components/VisualEntity'
import * as gameActions from '../actions/gameActions'
import * as appConstants from '../../const/appConstants'
import * as grammar from  '../../const/grammar'

class GameVisualizingContainer extends Component {

    constructor(props) {
        super(props)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.addEntity = this.addEntity.bind(this)
        this.changeAppMode = this.changeAppMode.bind(this)
        this.updateVisualContainerSize = this.updateVisualContainerSize.bind(this)
    }

    addEntity() {
        this.props.actions.addNewEntity(appConstants.EntityType.SQUARE)
    }

    componentDidMount() {
        window.addEventListener('keydown', this.onKeyDown)
    }

    componentDidUpdate(prevProps) {
        if (prevProps.turnInProgress && prevProps.turnInProgress !== this.props.turnInProgress) {
            this.props.actions.doEnemiesTurn()
        }
    }

    changeAppMode() {
        this.props.appMode === appConstants.AppMode.EDITING ? this.props.actions.enterGameMode() : this.props.actions.enterEditingMode()
    }

    updateVisualContainerSize(event) {
        this.props.actions.updateGameBoardSize(event)
    }

    onKeyDown(e) {
        if (this.props.turnInProgress || this.props.appMode !== appConstants.AppMode.GAME) {
            return
        }
        if (e.keyCode === 37) {
            e.preventDefault()
            this.props.actions.doTurn(grammar.ON_KEY_LEFT)
        } else if (e.keyCode === 38) {
            e.preventDefault()
            this.props.actions.doTurn(grammar.ON_KEY_UP)
        } else if (e.keyCode === 39) {
            e.preventDefault()
            this.props.actions.doTurn(grammar.ON_KEY_RIGHT)
        } else if (e.keyCode === 40) {
            e.preventDefault()
            this.props.actions.doTurn(grammar.ON_KEY_DOWN)
        }
    }

    render() {
        let theStyle = {backgroundColor: this.props.appMode === appConstants.AppMode.EDITING ? 'white' : '#d1d6d8'}

        return (

            <div className='visualContainer' style={theStyle} ref='vizContainer' onResize={this.updateVisualContainerSize()}>
                <div className='toolbar'>
                    <Button onClick={this.changeAppMode} icon='glyphicon-film'
                            text={ this.props.appMode === appConstants.AppMode.EDITING ? 'Start Game' : 'Stop Game'}/>
                </div>
                <div>
                    <VisualEntity data={this.props.mainCharacter} onClick={this.props.actions.selectEntity}/>
                    <VisualEntity data={this.props.enemy} onClick={this.props.actions.selectEntity}/>
                </div>
            </div>
        )
    }
}

function select(state) {
    return {
        selectedEntityId: state.gameReducer.get(grammar.SELECTED_ENTITY_ID),
        mainCharacter: state.gameReducer.get(grammar.MAIN_CHARACTER_PROTOTYPE),
        enemy: state.gameReducer.get(grammar.ENEMY_PROTOTYPE),
        selectedEntityRole: state.gameReducer.get(grammar.SELECTED_ENTITY_ROLE),
        appMode: state.gameReducer.get(grammar.APP_MODE),
        turnInProgress: state.gameReducer.get(grammar.TURN_IN_PROGRESS)
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
)(GameVisualizingContainer)