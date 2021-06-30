import React from 'react'
import { connect } from 'react-redux'
//@ts-expect-error
import { useHistory } from 'react-router-dom';

import { hangUp, toggleMute, toggleVideo, toggleDeafen } from '../actions';

interface Props {
    isMuted: boolean,
    isVideoOff: boolean,
    isDeafened: boolean,
    hangUp: Function,
    toggleMute: Function,
    toggleVideo: Function,
    toggleDeafen: Function   
}

export const MenuButtons = (props: Props) => {
    const { hangUp, toggleMute, isMuted, toggleVideo, isVideoOff, toggleDeafen, isDeafened } = props;
    const history = useHistory();
  
    const renderMicButton = isMuted === true ? 'mic_off':'mic';
    const renderVideoButton = isVideoOff === true ? 'videocam_off':'videocam';
    const renderDeafenButton = isDeafened === true ? 'headset_off':'headset';

    const hangUpButton = () => {
        hangUp();
        history.push('/');
    }

    const toggleMuteButton = () => {
        toggleMute();
    }

    const toggleVideoButton = () => {
        toggleVideo();
    }
    const toggleDeafenButton = () => {
        toggleDeafen();
    }

    return (
        <div className='menu-container' >
            <button className='button-menu' onClick={() => toggleMuteButton()} >
                <span className='fullscreen-icon material-icons'> {renderMicButton} </span>
            </button>
            <button className='button-menu' onClick={() => toggleDeafenButton()} >
                <span className='fullscreen-icon material-icons'> {renderDeafenButton} </span>
            </button>
            <button className='button-menu' onClick={() => toggleVideoButton()} >
                <span className='fullscreen-icon material-icons'> {renderVideoButton} </span>
            </button>
            <button className='button-menu' onClick={() => hangUpButton()} >
                <span className='fullscreen-icon material-icons'> call_end </span>
            </button>
        </div>
    )
}

const mapStateToProps = (state: any) => ({
    isInitialized: state.peerConnection.isInitialized,
    streamError: state.localStream.streamError,
    localStream: state.localStream.stream,
    remoteStream: state.remoteStream.stream,
    isAvailable: state.remoteStream.isAvailable,
    connectionError: state.peerConnection.error,
    isMuted: state.localStream.isMuted,
    isVideoOff: state.localStream.isVideoOff,
    hasCallEnded: state.peerConnection.hasCallEnded,
    isDeafened: state.remoteStream.isDeafened,
})

const mapDispatchToProps = {
    hangUp,
    toggleMute,
    toggleVideo,
    toggleDeafen
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons)
