import React, { Component, PropTypes } from 'react'
import TextualEditor from '../components/TextualEditor'

class CodingContainer extends Component {
    render () {
        return (
            <div style={{width : '100%', height: '40%', backgroundColor : 'green' ,display : 'inline-block'}}>
                <TextualEditor
                    value='hhhh'
                    />
            </div>
        )
    }
}

export default CodingContainer
