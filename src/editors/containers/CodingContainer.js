import React, { Component, PropTypes } from 'react'
import TextualEditor from '../components/TextualEditor'
import CodeDefinition from '../components/CodeDefinition'

class CodingContainer extends Component {
    render () {
        return (
            <div className='codeContainer'>
                <CodeDefinition/>
                <TextualEditor
                    value='hhhh'
                    />
            </div>
        )
    }
}

export default CodingContainer
