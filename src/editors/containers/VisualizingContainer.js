import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {Button} from 'react-mdl'
import VisualEntity from '../components/VisualEntity'
import * as editorsActions from '../actions/editorsActions'
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
        if (this.props.appMode === appConstants.AppMode.GAME) {
            window.addEventListener('keydown', this.onKeyDown)
            let runNextDemoLine = this.props.actions.runNextDemoLine
            setTimeout(function () {
                runNextDemoLine('1')}, 1100)
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

        return (

            <div className='visualContainer'>
                <div className='toolbar'>
                    <Button style={{minWidth: '0', width: '90px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.addEntity}>
                        Add Entity
                    </Button>
                    <Button style={{minWidth: '0', width: '90px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.playDemo}>
                        Play Demo
                    </Button>
                    <Button style={{minWidth: '0', width: '100px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.resetDemo}>
                        Reset Demo
                    </Button>
                    <Button style={{minWidth: '0', width: '60px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.pauseDemo}>
                        Pause
                    </Button>
                    <Button style={{minWidth: '0', width: '120px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.changeAppMode}>
                        { this.props.appMode === appConstants.AppMode.EDITING ? 'Start Game' : 'Start Editing'}
                    </Button>
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
        selectedEntityId: state.editorsReducer.get(grammar.SELECTED_ENTITY_ID),
        entities: state.editorsReducer.get(grammar.ENTITIES),
        demos   : state.editorsReducer.get(grammar.DEMOS),
        appMode   : state.editorsReducer.get(grammar.APP_MODE)
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