import React, { Component } from 'react'
import KeyValueListItem from './KeyValueListItem'

export default class KeyValueList extends Component {
    constructor(props){
        super(props)
        this.onItemClicked = this.onItemClicked.bind(this)
    }

    onItemClicked(item) {
        this.props.onItemClicked(item)
    }

    render() {
        return (
            <div className='list'>
                {this.props.listItems.map((listItem) =>
                    <KeyValueListItem
                        id={listItem.id}
                        text={listItem.text}
                        inputValue={listItem.inputValue}
                        isSelected={listItem.isSelected}
                        onClick={this.onItemClicked}
                    />
                )}
            </div>
        )
    }
}
