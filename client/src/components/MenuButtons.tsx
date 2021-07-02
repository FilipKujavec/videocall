import React from 'react'
import { connect } from 'react-redux'
//@ts-expect-error
import { useHistory } from 'react-router-dom';

import { hangUp, toggleMute, toggleVideo, toggleDeafen } from '../actions';

interface Props {
    isMuted: boolean,
    isVideoOff: boolean,
    isDeafened: boolean,
    hangUp: () => void,
    toggleMute: () => void,
    toggleVideo: () => void,
    toggleDeafen: () => void   
}

export const MenuButtons = (props: Props) => {
    const { hangUp, toggleMute, isMuted, toggleVideo, isVideoOff, toggleDeafen, isDeafened } = props;
    const history = useHistory();
  
    const micButtonIconClass = isMuted === true ? 'mic_off':'mic';
    const deafenButtonIconClass = isDeafened === true ? 'headset_off':'headset';
    const videoButtonIconClass = isVideoOff === true ? 'videocam_off':'videocam';

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
            <button className='menu button' onClick={() => toggleMuteButton()} >
                <span className='fullscreen-icon material-icons'> {micButtonIconClass} </span>
            </button>
            <button className='menu button' onClick={() => toggleDeafenButton()} >
                <span className='fullscreen-icon material-icons'> {deafenButtonIconClass} </span>
            </button>
            <button className='menu button' onClick={() => toggleVideoButton()} >
                <span className='fullscreen-icon material-icons'> {videoButtonIconClass} </span>
            </button>
            <button className='menu button' onClick={() => hangUpButton()} >
                <span className='fullscreen-icon material-icons'> call_end </span>
            </button>
        </div>
    );
}

const mapStateToProps = (state: any) => ({
    isMuted: state.localStream.isMuted,
    isVideoOff: state.localStream.isVideoOff,
    isDeafened: state.remoteStream.isDeafened,
});

const mapDispatchToProps = {
    hangUp,
    toggleMute,
    toggleVideo,
    toggleDeafen
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuButtons);
