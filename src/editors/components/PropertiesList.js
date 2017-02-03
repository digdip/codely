import React, { Component, PropTypes } from 'react'
import {DataTable, TableHeader} from 'react-mdl'

class PropertiesList extends Component {

    render () {
        if (this.props.data) {
            let properties = this.props.data.get('properties')
            let tableModel = []
            properties.map ((value, key) =>
                tableModel.push({
                    propertyName : key,
                    propertyValue : value
                })
            )

            return (
                <div className='codeDefinitionContainer'>
                    <div className='header'>Properties</div>
                    <DataTable
                        shadow={0}
                        rows={tableModel}
                        className='propertiesTable'>
                        <TableHeader name="propertyName" tooltip="The amazing material name">Property Name</TableHeader>
                        <TableHeader name="propertyValue" tooltip="The amazing material name">Value</TableHeader>
                    </DataTable>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}

export default PropertiesList
