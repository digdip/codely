import React, { Component } from 'react'

export default class KeyValueListItem extends Component {

    constructor(props){
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.onClick({key : this.props.id, value : this.props.inputValue})
    }

    render() {
//        let className = this.props.isSelected ? 'keyValueListItem-selected' : 'keyValueListItem'
        return (
            <div className='keyValueListItem'>
                <div onClick={this.onClick}>{this.props.text}</div>
                <input value={this.props.inputValue}/>
            </div>
        )
    }
}