import React from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/yaml'
import 'brace/mode/python'
import 'brace/theme/textmate'
import 'brace/ext/language_tools'

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
        value: React.PropTypes.string,
        width: React.PropTypes.string,
        height: React.PropTypes.string,
        fontSize: React.PropTypes.number
    },

    getDefaultProps:function() {
        return {
            disabled: false,
            value: '',
            width: '100%',
            fontSize: 14
        }
    },

    onLoad(editor) {
        if (!this.props.disabled) {
            editor.focus()
        }
    },

    render() {
        let timeStep = new Date().getTime()
        let height = this.props.height
        if (height !== undefined && parseInt(height, 10) < 0) {
            height = undefined
        }
        return (
            <div>
                <AceEditor
                    ref="editor"
                    theme="textmate"
                    name={this.props.seleniumId + '_textualEditor_' + timeStep}
                    value={this.props.value}
                    readOnly = {this.props.disabled}
                    highlightActiveLine = {!this.props.disabled}
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
