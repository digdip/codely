import React, { Component } from 'react'
import ListItem from './ListItem'

export default class List extends Component {
    constructor(props){
        super(props)
        this.onItemClicked = this.onItemClicked.bind(this)
    }

    onItemClicked(id) {
        this.props.onItemClicked(id)
    }

    render() {
        return (
            <ul className='list'>
                {this.props.listItems.map((listItem) =>
                    <ListItem {...listItem}
                        id={listItem.id}
                        text={listItem.text}
                        isSelected={listItem.isSelected}
                        onClick={this.onItemClicked}
                    />
                )}
            </ul>
        )
    }
}
