import React, { Component, PropTypes } from 'react'
import {DataTable, TableHeader} from 'react-mdl'

class MethodsList extends Component {

    render () {
        if (this.props.selectedEntity) {
            let properties = this.props.selectedEntity.methods
            let tableModel = []
            Object.keys(properties).map ((methodName) =>
                tableModel.push({
                    methodName : methodName
                })
            )

            return (
                <div className='codeDefinitionContainer'>
                    <DataTable
                        shadow={0}
                        rows={tableModel}>
                        <TableHeader name="methodName">Method Name</TableHeader>
                    </DataTable>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}

export default MethodsList