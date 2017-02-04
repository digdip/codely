import React, { Component, PropTypes } from 'react'
import KeyValueList from '../../infra-components/KeyValueList'

class PropertiesList extends Component {
    constructor(props) {
        super(props)
        this.onItemClicked = this.onItemClicked.bind(this)
    }

    onItemClicked(item) {
        this.props.insertTextToMethod(this.props.data.get('id'), this.props.data.get('selectedMethod'), item.key)
    }

    render () {
        if (this.props.data) {
            let properties = this.props.data.get('properties')
            let tableModel = []
            properties.map ((value, key) =>
                tableModel.push({
                    id : key,
                    text : key,
                    inputValue : value
                })
            )

            return (
                <div className='codeDefinitionContainer'>
                    <div className='header'>Properties</div>
                    <div className='toolbar'/>
                    <KeyValueList className='keyValueList'
                        listItems={tableModel}
                        onItemClicked={this.onItemClicked}>
                    </KeyValueList>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}

export default PropertiesList
