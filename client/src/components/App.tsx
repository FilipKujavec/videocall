import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createRoom, openCamera, joinRoom } from '../actions';
//@ts-expect-error
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './Home';
import Call from './Call';

interface Props {
  localStream: MediaStream,
  openCamera: () => void,
}

export const App = (props: Props) => {
  const { localStream, openCamera } = props


  useEffect(() => {
    if (localStream === null) {
      openCamera();
    }
  }, [localStream])

  return (
    <Router>
      <header>
        <Link to='/'> <h1 className='header' >VideoCall</h1> </Link>
      </header>

      <div className='container'>
        <div className='wrapper' >
          <Switch>
            <Route path='/:id' component={Call} />
            <Route path='/' component={Home} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

const mapStateToProps = (state: any) => ({
  localStream: state.localStream.stream,
});

const mapDispatchToProps = {
  createRoom,
  openCamera,
  joinRoom
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
