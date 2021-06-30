import { combineReducers } from "redux";
import { firestoreReducer } from 'redux-firestore'
import { firebaseReducer } from 'react-redux-firebase'
import LocalStreamReducer from "./LocalStreamReducer";
import RemoteStreamReducer from "./RemoteStreamReducer";
import PeerConnectionReducer from "./PeerConnectionReducer";

export default combineReducers({
    firestore: firestoreReducer,
    firebase: firebaseReducer,
    localStream: LocalStreamReducer,
    remoteStream: RemoteStreamReducer,
    peerConnection: PeerConnectionReducer
})