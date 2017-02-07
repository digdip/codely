import React from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/coffee'
import 'brace/theme/textmate'
import 'brace/ext/language_tools'
import {Button, Icon} from 'react-mdl'

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
        this.props.runCode(this.props.data.get('id'), this.props.data.get('selectedMethod'))
    },

    componentDidUpdate(prevProps) {
        let selectedMethodBody = this.props.data ? this.props.data.getIn(['methods', this.props.data.get('selectedMethod')]) : ''
        let prevSelectedMethodBody = prevProps.data ? prevProps.data.getIn(['methods', prevProps.data.get('selectedMethod')]) : ''
        let runNextLine = this.props.runNextLine
        let entityId = this.props.data.get('id')
        if (selectedMethodBody !== prevSelectedMethodBody) {
            this.refs.editor.editor.focus()
        }
        if (this.props.data.getIn(['run', 'lineNumber']) > -1) {
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

        let selectedMethodBody = this.props.data ? this.props.data.getIn(['methods', this.props.data.get('selectedMethod')]) : ''

        return (
            <div className='codeTextEditorContainer'>
                <div className='toolbar'>
                    <Button style={{minWidth: '0', width: '50px', height: '30px', padding: '2px', lineHeight: '0'}}
                            onClick={this.runCode}>
                        Run
                    </Button>
                </div>
                <AceEditor
                    ref="editor"
                    theme="textmate"
                    name={this.props.seleniumId + '_textualEditor_' + timeStep}
                    value={selectedMethodBody}
                    readOnly={!this.props.data || !this.props.data.get('selectedMethod')}
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
                    fontSize={this.props.fontSize}/>
            </div>
        )
    }
})
export default TextualEditor
