import React, { Component, PropTypes } from 'react'
import {DataTable, TableHeader, Button, Icon, Dialog, DialogTitle, DialogContent, DialogActions, Textfield} from 'react-mdl'

class MethodsList extends Component {

    constructor(props) {
        super(props)
        this.closeDialog = this.closeDialog.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.addNewMethod = this.addNewMethod.bind(this)
        this.state = {
            isAddMethodDialogOpen: false
        }
    }

    openDialog() {
        this.setState({isAddMethodDialogOpen: true})
    }

    closeDialog() {
        this.setState({isAddMethodDialogOpen: false})
    }

    addNewMethod() {
        this.closeDialog()
        this.props.addNewMethod(this.props.selectedEntity.id, this.refs.methodNameField.inputRef.value)
    }

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
                        <Button style={{minWidth: '0', width: '30px', height: '30px', padding: '0', lineHeight: '0'}}
                                onClick={this.openDialog}>
                            <Icon name="add" style={{fontSize: '18'}}/>
                        </Button>
                    </div>
                    <DataTable
                        shadow={0}
                        rows={tableModel}>
                        <TableHeader name="methodName">Method Name</TableHeader>
                    </DataTable>
                    <Dialog open={this.state.isAddMethodDialogOpen}>
                        <DialogContent>
                            <Textfield
                                ref='methodNameField'
                                label="Method Name"
                                floatingLabel
                                style={{width: '200px'}}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button type='button' onClick={this.addNewMethod}>OK</Button>
                            <Button type='button' onClick={this.closeDialog}>Cancel</Button>
                        </DialogActions>
                    </Dialog>
                </div>
            )
        } else {
            return (<div/>)
        }
    }
}

export default MethodsList