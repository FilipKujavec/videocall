import React from 'react'
import ReactDOM from 'react-dom'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import { createFirestoreInstance, getFirestore } from "redux-firestore"
import firebase from 'firebase/app'
import { ReactReduxFirebaseProvider, getFirebase } from "react-redux-firebase"
import 'firebase/storage'
import 'firebase/firestore'

import './index.scss'
import App from './components/App'
import reducers from './reducers'
import fbConfig from './config/fbConfig'

firebase.initializeApp(fbConfig)
firebase.firestore()

//Create store with thunk and devtools
const middlewares = [thunk.withExtraArgument({getFirebase, getFirestore})]
// @ts-ignore
// const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__(applyMiddleware(...middlewares))
const composeEnhancers = applyMiddleware(...middlewares)
const store = createStore(reducers, composeEnhancers)

const rrfConfig = {
  rooms: 'rooms',
  useFirestoreForProfile: true,
  useFirestoreForStorageMeta: true,
}

const rrfProps = {
  firebase,
  config: rrfConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

ReactDOM.render(
  <Provider store={store}>
    <ReactReduxFirebaseProvider {...rrfProps} >
      <App />
    </ReactReduxFirebaseProvider>
  </Provider>,
  document.getElementById('root')
);