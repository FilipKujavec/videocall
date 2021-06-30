import React, { useEffect, useRef, useState } from 'react'
import { connect } from 'react-redux'
//@ts-expect-error
import { useHistory } from 'react-router-dom';

import { joinRoom, openCamera, addLocalTracks, hangUp } from '../actions'
import MenuButtons from './MenuButtons';

declare global {
    interface Window {
        fullscreenEnabled: boolean;
    }
}

interface Props {
    isInitialized: boolean,
    hasCallEnded: boolean,
    isAvailable: boolean,
    joinRoom: Function, 
    openCamera: Function, 
    match: {
        params: {
            id: string
        }
    },
    localStream: MediaStream, 
    remoteStream: MediaStream, 
    hangUp: Function, 
}

export const Call = (props: Props) => {
    const { isInitialized, joinRoom, openCamera, match, localStream, remoteStream, isAvailable, hangUp, hasCallEnded } = props;
    const localStreamRef = useRef<HTMLVideoElement>(null);
    const remoteStreamRef = useRef<HTMLVideoElement>(null);
    const [isFullscreen, SetIsFullscreen] = useState(false);
    const history = useHistory();

    const callId = match.params.id

    const toggleFullScreen = async () => {
        const el = document.getElementById('fullscreen');
        if (el) {
            if (el !== null && isFullscreen === false) {
                await el.requestFullscreen();
            }
            if (isFullscreen === true) {
                await document.exitFullscreen();
            }
            SetIsFullscreen(isFullscreen === true ? false:true);
        }
    }

    useEffect(() => {
        //If localStream exist
        if (null !== localStream) {
            if (localStreamRef.current !== null) {
                //Add it to <video />
                localStreamRef.current.srcObject = localStream;
            }
            // If there is no call going on connect to the room
            if (isInitialized === false) {
                joinRoom(callId);
            }
        }

        //If localStream does not exist open the camera
        if (localStream === null) {
            openCamera();
        }
        // eslint-disable-next-line
    }, [localStream])

    useEffect(() => {
        //If remoteStream exist
        if (remoteStreamRef.current !== null) {
            //Add it to <video />
            remoteStreamRef.current.srcObject = remoteStream;
        }
         // eslint-disable-next-line
    }, [isAvailable])

    useEffect(() => {
        //hangUp() when the component gets closed
        return () => {
            hangUp();
        }
    }, [])

    useEffect(() => {
        //If the call disconnects hangUp() and go to '/'
        if (hasCallEnded === true) {
            hangUp();
            history.push('/');
        }
    }, [hasCallEnded])

    const fullscreenButton = isFullscreen === true ? 'fullscreen_exit':'fullscreen';

    return (
        <div id='fullscreen' className='stream-container' >
            <video className='remoteVideo' ref={remoteStreamRef} autoPlay />
            <video className='localVideo' ref={localStreamRef} autoPlay muted />

            <button className='button-fullscreen' onClick={() => toggleFullScreen()} >
                <span className='fullscreen-icon material-icons'> {fullscreenButton} </span>
            </button>

            <MenuButtons />
        </div>
    );
}


const mapStateToProps = (state: any) => ({
    isInitialized: state.peerConnection.isInitialized,
    localStream: state.localStream.stream,
    remoteStream: state.remoteStream.stream,
    isAvailable: state.remoteStream.isAvailable,
    connectionError: state.peerConnection.error,
    hasCallEnded: state.peerConnection.hasCallEnded,
});

const mapDispatchToProps = {
    joinRoom,
    openCamera,
    addLocalTracks,
    hangUp,
}

export default connect(mapStateToProps, mapDispatchToProps)(Call);
