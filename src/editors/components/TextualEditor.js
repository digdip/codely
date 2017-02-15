import React from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/coffee'
import 'brace/theme/textmate'
import 'brace/ext/language_tools'
import {Button, Icon} from 'react-mdl'
import * as grammar from  '../../const/grammar'

/*
 Wrapper for ReactAce
 props.seleniumId - Id for Selenium
 props.disabled - True or False
 props.value - initial value in the editor
 props.width - width of the editor
 props.height - height of the editor
 */

const TextualEditor = React.createClass({

    propTypes: {
        disabled: React.PropTypes.bool,
        value   : React.PropTypes.string,
        width   : React.PropTypes.string,
        height  : React.PropTypes.string,
        fontSize: React.PropTypes.number
    },

    getDefaultProps() {
        return {
            disabled: false,
            value   : '',
            width   : '100%',
            fontSize: 14
        }
    },

    onLoad(editor) {
        if (!this.props.disabled) {
            editor.focus()
        }
    },

    runCode() {
        this.props.runCode(this.props.data.get(grammar.ID), this.props.data.get(grammar.SELECTED_METHOD))
    },

    resetPosition() {
        this.props.resetEntity(this.props.data.get(grammar.ID))
    },

    pauseEntity() {
        this.props.pauseEntity(this.props.data.get(grammar.ID))
    },

    componentDidUpdate(prevProps) {
        let selectedMethodBody = this.props.data ? this.props.data.getIn([grammar.METHODS, this.props.data.get(grammar.SELECTED_METHOD)]) : ''
        let prevSelectedMethodBody = prevProps.data ? prevProps.data.getIn([grammar.METHODS, prevProps.data.get(grammar.SELECTED_METHOD)]) : ''
        let runNextLine = this.props.runNextLine
        let entityId = this.props.data.get(grammar.ID)
        if (selectedMethodBody !== prevSelectedMethodBody) {
            this.refs.editor.editor.focus()
        }
        if (this.props.data.getIn([grammar.RUN_DATA, grammar.LINE_NUMBER]) > -1) {
            setTimeout(function () {
                runNextLine(entityId)}, 1100)
        }

    },

    render() {
        let timeStep = new Date().getTime()
        let height = this.props.height
        if (height !== undefined && parseInt(height, 10) < 0) {
            height = undefined
        }

        let selectedMethodBody = this.props.data ? this.props.data.getIn([grammar.METHODS, this.props.data.get(grammar.SELECTED_METHOD), grammar.METHOD_SCRIPT]) : ''

        return (
            <div className='codeTextEditorContainer'>
                <div className='toolbar'>
                    <Button style={{minWidth: '0', width: '50px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.runCode}>
                        Run
                    </Button>
                    <Button style={{minWidth: '0', width: '60px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.resetPosition}>
                        Reset
                    </Button>
                    <Button style={{minWidth: '0', width: '60px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.pauseEntity}>
                        Pause
                    </Button>
                </div>
                <AceEditor
                    ref="editor"
                    theme="textmate"
                    name={this.props.seleniumId + '_textualEditor_' + timeStep}
                    value={selectedMethodBody}
                    readOnly={!this.props.data || !this.props.data.get(grammar.SELECTED_METHOD)}
                    highlightActiveLine={!this.props.disabled}
                    editorProps={{$blockScrolling: true}}
                    setOptions={{highlightGutterLine: !this.props.disabled}}
                    enableBasicAutocompletion={true}
                    showPrintMargin={false}
                    enableLiveAutocompletion={true}
                    onLoad={this.onLoad}
                    onChange={this.props.onChange}
                    onBlur={this.props.onBlur}
                    height={height}
                    width={this.props.width}
                    fontSize={this.props.fontSize}
                    mode='coffee'
                />
            </div>
        )
    }
})
export default TextualEditor
