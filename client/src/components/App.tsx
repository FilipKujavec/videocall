import React, { useRef, useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { createRoom, openCamera, joinRoom } from '../actions';
//@ts-expect-error
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

import Home from './Home';
import Call from './Call';

export const App = (props: any) => {
  const { localStream, remoteStream } = props
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const [inputState, setInputState] = useState('');


  useEffect(() => {
    if (localStream === null) {
      props.openCamera();
    }
  }, [localStream])

  return (
    <>
      <Router>
        <header>
          <Link to='/'> <h1>VideoCall</h1> </Link>
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
    </>
  );
}

const mapStateToProps = (state: any) => ({
  localStream: state.localStream.stream,
  remoteStream: state.remoteStream
});

const mapDispatchToProps = {
  createRoom,
  openCamera,
  joinRoom
}


export default connect(mapStateToProps, mapDispatchToProps)(App);
