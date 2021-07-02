import React, { useState } from 'react';
import { connect } from 'react-redux';
//@ts-expect-error
import { useHistory } from 'react-router-dom'

import { createRoom } from '../actions';

interface History {
    push: (...args: string[]) => void,
}

interface Props {
    createRoom: (...args: History[]) => void
}

export const Home = (props: Props) => {
    const { createRoom } = props
    const [inputState, setInputState] = useState('');
    const history = useHistory();

    const onClick = () => {
        createRoom(history);
    }
    
    const onSubmit = async (e: any) => {
        e.preventDefault();
        history.push(`${inputState}`);
    }

    return (
        <>
        <form onSubmit={(e) => onSubmit(e)}>
            <input className='home input' placeholder='Enter the Call ID:' value={inputState} onChange={(e) => setInputState(e.target.value)} />
            <button className='home button' > Join Call </button>
        </form>

        <div className='split'>
            <hr className='left'/>
            <p>or</p>
            <hr className='right'/>
        </div>

        <button className='home button' onClick={() => onClick()}> Create Call </button>
        </>
    );
}

const mapStateToProps = (state: any) => ({

});

const mapDispatchToProps = {
    createRoom,
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
