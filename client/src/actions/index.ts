import { Duplex, Stream } from "stream";
import { ADD_SNAPSHOT, CALL_ENDED, HANG_UP, INITIALIZE_PEER_CONNECTION, JOIN_ROOM_ERROR, OPEN_CAMERA, OPEN_CAMERA_ERROR, RECEIVED_REMOTE_TRACK, TOGGLE_DEAFEN, TOGGLE_MUTE, TOGGLE_VIDEO } from "./types";

const configuration = {
    iceServers: [
      {
        urls: [
          'stun:stun1.l.google.com:19302',
          'stun:stun2.l.google.com:19302',
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };

export const openCamera = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => {
    
    const constraints = {
        video: { facingMode: "user" },
        audio: {
            autoGainControl: false,
            channelCount: 2,
            echoCancellation: false,
            latency: 0,
            noiseSuppression: true,
            sampleRate: 48000,
            sampleSize: 16,
            volume: 1.0
          }
    }

    let streams = null;

    try {
        streams = await navigator.mediaDevices.getUserMedia(constraints);
    }catch (err) {
        console.log(err)
        dispatch({ type: OPEN_CAMERA_ERROR });
        return;
    }

    dispatch({ type: OPEN_CAMERA, payload: streams});

}

export const addLocalTracks = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => { 
    console.log('ADDED LOCAL TRACKS')
    const localStream = getState().localStream.stream;
    const peerConnection = getState().peerConnection.peerConnection;

    try {
    //Add local tracks to peerConnection
    localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track);
    });
    } catch {

    }
}

export const createRoom = (history: any) => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => { 
    const firestore = getFirestore();  
    const roomRef = firestore.collection('rooms').doc();
    const localStream = getState().localStream.stream;
    const peerConnection = getState().peerConnection.peerConnection;

    console.log(peerConnection)

    dispatch({ type: INITIALIZE_PEER_CONNECTION, payload: configuration});
    
    //Add local tracks to peerConnection
    localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track);
    });

    //Dispatch remote tracks
    peerConnection.addEventListener('track', (event: any) => {
        console.log('RECIEVED REMOTE TRACK')
        dispatch({ type: RECEIVED_REMOTE_TRACK, payload: event.track });
    });

    //Collect ICE candidates
    const callerCandidatesCollection = roomRef.collection('callerCandidates');

    peerConnection.addEventListener('icecandidate', (event: any) => {
        if (!event.candidate) {
        console.log('Got final candidate!');
        return;
        }
        console.log('Got candidate: ', event.candidate);
        callerCandidatesCollection.add(event.candidate.toJSON());
    });


    const offer = await peerConnection.createOffer();

    await peerConnection.setLocalDescription(offer);

    const roomWithOffer = {
        offer: {
            type: offer.type,
            sdp: offer.sdp
        }
    }

    console.log(roomWithOffer)

    roomRef.set(roomWithOffer);
    const roomId = roomRef.id;
    history.push(`/${roomId}`)
    console.log(roomId)


    //Listen for remote session description
    roomRef.onSnapshot(async (snapshot: any) => {
        console.log('Got updated room:', snapshot.data());
        console.log(peerConnection)

        const data = snapshot.data();

        if (!peerConnection.currentRemoteDescription && data.answer) {
            console.log('Set remote description: ', data.answer);
            const answer = new RTCSessionDescription(data.answer)
            await peerConnection.setRemoteDescription(answer);
        }
    });

    //Listen for remote ICE candidates
    const snapshotUnsubsribe = roomRef.collection('calleeCandidates').onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach(async (change: any) => {
          if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
          }
        });
    });

    dispatch({ type: ADD_SNAPSHOT, payload: snapshotUnsubsribe})

    //Call hangUp() function in case of failure
    peerConnection.oniceconnectionstatechange = function(event: any) {
        if (peerConnection.iceConnectionState === "failed" ||
            peerConnection.iceConnectionState === "disconnected" ||
            peerConnection.iceConnectionState === "closed") {
            dispatch({ type: CALL_ENDED })
        }
    };
}

export const joinRoom = (id: string) => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => { 
    const firestore = getFirestore();
    const localStream = getState().localStream.stream;

    const roomRef = firestore.collection('rooms').doc(id);
    const roomSnapshot = await roomRef.get();
    console.log(id)

    if (!roomSnapshot.exists) return dispatch({ type: JOIN_ROOM_ERROR, payload: 'This room does not exist!' })

    dispatch({ type: INITIALIZE_PEER_CONNECTION })

    const peerConnection = getState().peerConnection.peerConnection

    //Add local tracks to peerConnection
    localStream.getTracks().forEach((track: any) => {
        peerConnection.addTrack(track);
    });

    //Dispatch remote tracks
    peerConnection.addEventListener('track', (event: any) => {
        console.log(event.track)
        dispatch({ type: RECEIVED_REMOTE_TRACK, payload: event.track });
    });

    //Collect ICE candidates
    const calleeCandidatesCollection = roomRef.collection('calleeCandidates');
    peerConnection.addEventListener('icecandidate', (event: any) => {
        if (!event.candidate) {
        console.log('Got final candidate!');
        return;
        }
        console.log('Got candidate: ', event.candidate);
        calleeCandidatesCollection.add(event.candidate.toJSON());
    });

    //Create SDP Answer
    const offer = roomSnapshot.data().offer;
    await peerConnection.setRemoteDescription(offer);
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    const roomWithAnswer = {
        answer: {
            type: answer.type,
            sdp: answer.sdp
        }
    }

    await roomRef.update(roomWithAnswer);

    //Listen for remote ICE candidates
    const snapshotUnsubsribe = roomRef.collection('callerCandidates').onSnapshot((snapshot: any) => {
        snapshot.docChanges().forEach(async (change: any) => {
            if (change.type === 'added') {
            let data = change.doc.data();
            console.log(`Got new remote ICE candidate: ${JSON.stringify(data)}`);
            await peerConnection.addIceCandidate(new RTCIceCandidate(data));
            }
        });
    });

    dispatch({ type: ADD_SNAPSHOT, payload: snapshotUnsubsribe})

    //Call hangUp() function in case of failure
    peerConnection.oniceconnectionstatechange = function(event: any) {
        if (peerConnection.iceConnectionState === "failed" ||
            peerConnection.iceConnectionState === "disconnected" ||
            peerConnection.iceConnectionState === "closed") {
            dispatch(hangUp());
        }
    };

}

export const hangUp = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => { 
    const peerConnection = getState().peerConnection.peerConnection;
    const unsubscribeFromSnapshot = getState().peerConnection.unsubscribeFromSnapshot

    peerConnection.close();

    unsubscribeFromSnapshot();

    dispatch({ type: HANG_UP })
}

export const toggleMute = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => {
    const tracks = getState().localStream.stream.getTracks();
    const isMuted = getState().localStream.isMuted;
    const isDeafened = getState().remoteStream.isDeafened;

    if (isDeafened === true) dispatch(toggleDeafen());

    tracks.forEach((track: any) => {
        if (track.kind === 'audio') {
            track.enabled = isMuted;
        }
    });

    dispatch({ type: TOGGLE_MUTE })    
}

export const toggleVideo = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => {
    const tracks = getState().localStream.stream.getTracks();
    const isVideoOff = getState().localStream.isVideoOff;

    tracks.forEach((track: any) => {
        if (track.kind === 'video') {
            track.enabled = isVideoOff;
        }
    });

    dispatch({ type: TOGGLE_VIDEO });
}

export const toggleDeafen = () => async (dispatch: Function, getState: Function, { getFirebase, getFirestore }:{ getFirebase: Function, getFirestore:Function }) => {
    const isMuted = getState().localStream.isMuted;
    const isDeafened = getState().remoteStream.isDeafened;
    const remoteTracks = getState().remoteStream.stream.getTracks();

    if (isDeafened === false) {
        remoteTracks.forEach((track: any) => {
            if (track.kind === 'audio') {
                track.enabled = isDeafened;
            }
        });

        if (isMuted === false) dispatch(toggleMute());

        dispatch({ type: TOGGLE_DEAFEN })

        return
    }

    remoteTracks.forEach((track: any) => {
        if (track.kind === 'audio') {
            track.enabled = isDeafened;
        }
    });

    dispatch({ type: TOGGLE_DEAFEN })
}
