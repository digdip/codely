import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import GameVisualizingContainer from '../game/containers/GameVisualizingContainer'
import GameCodingContainer from '../game/containers/GameCodingContainer'
import '../styles/main.scss'
import 'react-mdl/extra/material.css'
import 'react-mdl/extra/material.js'

class GameContainer extends Component {
  static propTypes = {
    store  : PropTypes.object.isRequired
  }

  render () {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div className='mainContainer'>
          <GameVisualizingContainer/>
          <GameCodingContainer/>
        </div>
      </Provider>
    )
  }
}

export default GameContainer
