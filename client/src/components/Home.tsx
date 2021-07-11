import React, { useState } from 'react';
import { connect } from 'react-redux';
//@ts-expect-error
import { useHistory } from 'react-router-dom'

import { createRoom, openCamera } from '../actions';

interface History {
    push: (...args: string[]) => void,
}

interface Props {
    createRoom: (...args: History[]) => void,
    openCamera: () => void,
    localStream: MediaStream,
}

export const Home = (props: Props) => {
    const { createRoom, openCamera, localStream } = props
    const [inputState, setInputState] = useState('');
    const [hasCreateButtonBeenClicked, setHasCreateButtonBeenClicked] = useState(false);
    const history = useHistory();

    const onClick = () => {
        setHasCreateButtonBeenClicked(true)
        if (!localStream) return null
        createRoom(history);
    }
    
    const onSubmit = async (e: any) => {
        e.preventDefault();
        history.push(`${inputState}`);
    }

    const renderError = () => {
        if (localStream) return null
        if (!hasCreateButtonBeenClicked) return null
        
        return (
            <div >
                <p className='error message' >You have open your camera first!</p>
                <button className='home button' onClick={() => openCamera()} >Open Camera</button>
            </div>
        )
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
        {renderError()}
        </>
    );
}

const mapStateToProps = (state: any) => ({
    localStream: state.localStream.stream,
});

const mapDispatchToProps = {
    createRoom,
    openCamera
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
