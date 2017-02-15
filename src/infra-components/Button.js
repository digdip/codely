import React, { Component } from 'react'

export default class Button extends Component {

    constructor(props){
        super(props)
        this.onClick = this.onClick.bind(this)
    }

    onClick() {
        this.props.onClick()
    }

    render() {
        
        return (
            <button onClick={this.onClick}>
                <i className={'glyphicon ' + this.props.icon}></i>
                {this.props.text}
            </button>
        )
    }
}