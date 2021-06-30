import React, { useState } from 'react';
import { connect } from 'react-redux';
//@ts-expect-error
import { useHistory, Link } from 'react-router-dom'

import { createRoom, joinRoom } from '../actions';

export const Home = (props: any) => {
    const [inputState, setInputState] = useState('');
    const history = useHistory();

    const onClick = () => {
        props.createRoom(history);
    }
    
    const onSubmit = async (e: any) => {
        e.preventDefault();
        history.push(`${inputState}`);
    }

    return (
        <>
        <form onSubmit={(e) => onSubmit(e)}>
        <input placeholder='Enter the Chat ID:' value={inputState} onChange={(e) => setInputState(e.target.value)} />
        <button className='button' > Join Call </button>
          </form>

          <div className='split'>
              <hr className='left'/>
              <p>or</p>
              <hr className='right'/>
          </div>

          <button className='button' onClick={() => onClick()}> Create Call </button>
        </>
    );
}

interface State {

}

const mapStateToProps = (state: State) => ({

});

const mapDispatchToProps = {
    createRoom,
    joinRoom
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
