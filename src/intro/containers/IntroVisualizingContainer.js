import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '../../infra-components/Button'
import VisualEntity from '../../common/components/VisualEntity'
import * as editorsActions from '../actions/introActions'
import * as appConstants from '../../const/appConstants'
import * as grammar from  '../../const/grammar'

class VisualizingContainer extends Component {

    constructor(props) {
        super(props)
        this.playDemo = this.playDemo.bind(this)
        this.resetDemo = this.resetDemo.bind(this)
        this.pauseDemo = this.pauseDemo.bind(this)
        this.onKeyDown = this.onKeyDown.bind(this)
        this.addEntity = this.addEntity.bind(this)
        this.changeAppMode = this.changeAppMode.bind(this)
    }

    addEntity() {
        this.props.actions.addNewEntity(appConstants.EntityType.SQUARE)
    }

    componentDidUpdate(prevProps) {
        if (this.props.demos.getIn(['1', grammar.RUN_DATA, grammar.RUN_STATUS]) === grammar.RunStatuses.RUNNING) {
            let runNextDemoLine = this.props.actions.runNextDemoLine
            setTimeout(function () {
                runNextDemoLine('1')}, 1100)
        }

        if (this.props.appMode === appConstants.AppMode.GAME) {
            window.addEventListener('keydown', this.onKeyDown)
        } else {
            window.removeEventListener('keydown', this.onKeyDown)
        }
    }

    playDemo() {
        this.props.actions.playDemo('1')
    }

    resetDemo() {
        this.props.actions.resetDemo('1')
    }

    pauseDemo() {
        this.props.actions.pauseDemo('1')
    }

    changeAppMode() {
        this.props.appMode === appConstants.AppMode.EDITING ? this.props.actions.enterGameMode() : this.props.actions.enterEditingMode()
    }

    onKeyDown (e) {
        if (e.keyCode === 37) {
            e.preventDefault()
            this.props.actions.runMethod(this.props.selectedEntityId, grammar.ON_KEY_LEFT)
        } else if (e.keyCode === 38) {
            e.preventDefault()
            this.props.actions.runMethod(this.props.selectedEntityId, grammar.ON_KEY_UP)
        } else if (e.keyCode === 39) {
            e.preventDefault()
            this.props.actions.runMethod(this.props.selectedEntityId, grammar.ON_KEY_RIGHT)
        } else if (e.keyCode === 40) {
            e.preventDefault()
            this.props.actions.runMethod(this.props.selectedEntityId, grammar.ON_KEY_DOWN)
        }
    }

    render() {
        let theStyle = {backgroundColor : this.props.appMode === appConstants.AppMode.EDITING ? 'white' : '#d1d6d8'}
        return (

            <div className='visualContainer' style={theStyle}>
                <div className='toolbar'>
                    <Button onClick={this.addEntity} icon='glyphicon-plus'/>
                    <Button onClick={this.playDemo} icon='glyphicon-play'/>
                    <Button onClick={this.resetDemo} icon='glyphicon-refresh'/>
                    <Button onClick={this.pauseDemo} icon='glyphicon-pause'/>
                    <Button onClick={this.changeAppMode} icon='glyphicon-film' text={ this.props.appMode === appConstants.AppMode.EDITING ? 'Start Game' : 'Stop Game'}/>
               </div>
                <div>
                    {this.props.entities.map((entity) =>
                        <VisualEntity data={entity.get(grammar.PROPERTIES)}/>
                    )}
                    <VisualEntity data={this.props.demos.getIn(['1', grammar.PROPERTIES])} isGhost={true}/>
                </div>
            </div>
        )
    }
}

function select(state) {
    return {
        selectedEntityId: state.introReducer.get(grammar.SELECTED_ENTITY_ID),
        entities: state.introReducer.get(grammar.ENTITIES),
        demos   : state.introReducer.get(grammar.DEMOS),
        appMode   : state.introReducer.get(grammar.APP_MODE)
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