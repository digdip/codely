import React, { Component, PropTypes } from 'react'
import {DataTable, TableHeader} from 'react-mdl'

class CodeDefinition extends Component {

    render () {
        if (this.props.selectedEntity) {
            let properties = this.props.selectedEntity.properties
            let tableModel = []
            Object.keys(properties).map ((propertyName) =>
                tableModel.push({
                    propertyName : propertyName,
                    propertyValue : properties[propertyName]
                })
            )

            return (
                <div className='codeDefinitionContainer'>
                    <DataTable
                        shadow={0}
                        rows={tableModel}
                    >
                        <TableHeader name="propertyName" tooltip="The amazing material name">Name</TableHeader>
                        <TableHeader name="propertyValue" tooltip="The amazing material name">Value</TableHeader>
                    </DataTable>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}

export default CodeDefinition
