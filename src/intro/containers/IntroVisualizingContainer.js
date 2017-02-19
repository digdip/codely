import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Button from '../../infra-components/Button'
import VisualEntity from '../../common/components/VisualEntity'
import * as introActions from '../actions/introActions'
import * as commonActions from '../../common/actions/commonActions'
import * as appConstants from '../../const/appConstants'
import * as grammar from  '../../const/grammar'

class IntroVisualizingContainer extends Component {

    constructor(props) {
        super(props)
        this.playDemo = this.playDemo.bind(this)
        this.resetDemo = this.resetDemo.bind(this)
        this.pauseDemo = this.pauseDemo.bind(this)
    }

    componentDidUpdate(prevProps) {
        if (this.props.demos.getIn(['1', grammar.RUN_DATA, grammar.RUN_STATUS]) === grammar.RunStatuses.RUNNING) {
            let runNextDemoLine = this.props.actions.runNextDemoLine
            setTimeout(function () {
                runNextDemoLine('1')}, 1100)
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

    render() {
        return (

            <div className='visualContainer'>
                <div className='toolbar'>
                    <Button onClick={this.playDemo} icon='glyphicon-play'/>
                    <Button onClick={this.resetDemo} icon='glyphicon-refresh'/>
                    <Button onClick={this.pauseDemo} icon='glyphicon-pause'/>
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
        selectedEntityId: '1',
        entities: state.introReducer.get(grammar.ENTITIES),
        demos   : state.introReducer.get(grammar.DEMOS)
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, introActions, commonActions), dispatch)
    }
}

export default connect(
    select,
    mapDispatchToProps
)(IntroVisualizingContainer)