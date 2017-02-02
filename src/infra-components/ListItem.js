import React, { Component } from 'react'

export default class ListItem extends Component {

    constructor(props){
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.onClick(this.props.id)
    }

    render() {
        let className = this.props.isSelected ? 'listItem-selected' : 'listItem'
        return (
            <li className={className} onClick={this.onClick}>{this.props.text}</li>
        )
    }
}