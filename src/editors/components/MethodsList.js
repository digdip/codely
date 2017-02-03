import React, { Component, PropTypes } from 'react'
import {Button, Icon, Dialog, DialogTitle, DialogContent, DialogActions, Textfield} from 'react-mdl'
import List from '../../infra-components/List'

class MethodsList extends Component {

    constructor(props) {
        super(props)
        this.closeDialog = this.closeDialog.bind(this)
        this.openDialog = this.openDialog.bind(this)
        this.addNewMethod = this.addNewMethod.bind(this)
        this.selectMethod = this.selectMethod.bind(this)
        this.state = {
            isAddMethodDialogOpen: false
        }
    }

    openDialog() {
        this.refs.methodNameField.inputRef.value = ''
        this.setState({isAddMethodDialogOpen: true})
    }

    closeDialog() {
        this.setState({isAddMethodDialogOpen: false})
    }

    addNewMethod() {
        this.closeDialog()
        this.props.addNewMethod(this.props.data.get('id'), this.refs.methodNameField.inputRef.value)
    }

    selectMethod(methodName) {
        this.props.selectMethod(this.props.data.get('id'), methodName)
    }

    render () {
        if (this.props.data) {
            let methods = this.props.data.get('methods')
            let tableModel = []
            methods.map ((methodCode, methodName) =>
                tableModel.push({
                    id: methodName,
                    text : methodName,
                    isSelected : this.props.data.get('selectedMethod') === methodName
                })
            )

            return (
                <div className='codeDefinitionContainer'>
                    <div className='header'>Methods</div>
                    <div className='toolbar'>
                        <Button style={{minWidth: '0', width: '30px', height: '30px', padding: '0', lineHeight: '0'}}
                                onClick={this.openDialog}>
                            <Icon name="add" style={{fontSize: '18'}}/>
                        </Button>
                    </div>
                    <List listItems={tableModel}
                          onItemClicked={this.selectMethod}/>
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