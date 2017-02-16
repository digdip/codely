import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import VisualizingContainer from '../intro/containers/IntroVisualizingContainer'
import CodingContainer from '../intro/containers/IntroCodingContainer'
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
          <VisualizingContainer/>
          <CodingContainer/>
        </div>
      </Provider>
    )
  }
}

export default GameContainer
