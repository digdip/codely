import React, { Component, PropTypes } from 'react'
import { Provider } from 'react-redux'
import VisualizingContainer from '../visualizing/containers/VisualizingContainer'
import CodingContainer from '../coding/containers/CodingContainer'

class AppContainer extends Component {
  static propTypes = {
    store  : PropTypes.object.isRequired
  }

  shouldComponentUpdate () {
    return false
  }

  render () {
    const { store } = this.props

    return (
      <Provider store={store}>
        <div style={{ height: '100%', width : '100%', position : 'fixed' }}>
          <VisualizingContainer/>
          <CodingContainer/>
        </div>
      </Provider>
    )
  }
}

export default AppContainer
