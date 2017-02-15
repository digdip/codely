import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import VisualizingContainer from '../editors/containers/VisualizingContainer'
import CodingContainer from '../editors/containers/CodingContainer'
import '../styles/main.scss'

class AppContainer extends Component {
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

export default AppContainer
