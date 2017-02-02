import React, { Component, PropTypes } from 'react'
import {DataTable, TableHeader, Button, Icon} from 'react-mdl'

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
                    <div className='toolbar'>
                        <Button style={{minWidth: '0', width: '30px', height: '30px', padding: '0', lineHeight: '0'}}>
                            <Icon name="add" style={{fontSize: '18'}}/>
                        </Button>
                    </div>
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