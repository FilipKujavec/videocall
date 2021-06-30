import { ADD_SNAPSHOT, CALL_ENDED, HANG_UP, INITIALIZE_PEER_CONNECTION, JOIN_ROOM_ERROR } from "../actions/types"

const initialState = {
    peerConnection: new RTCPeerConnection,
    hasCallEnded: false,
    isInitialized: false,
    error: false,
    unsubscribeFromSnapshot: Function,
}

export default (state = initialState, { type, payload }: { type: string, payload: any }) => {
    switch (type) {

    case INITIALIZE_PEER_CONNECTION:
        return { ...state, peerConnection: new RTCPeerConnection(payload), isInitialized: true };

    case JOIN_ROOM_ERROR:
        return { ...state, error: true };

    case HANG_UP:
        return {
            peerConnection: new RTCPeerConnection,
            hasCallEnded: false,
            isInitialized: false,
            error: false,
            unsubscribeFromSnapshot: Function,
        };

    case ADD_SNAPSHOT:
        return { ...state, unsubscribeFromSnapshot: payload }
    
    case CALL_ENDED:
        return { ...state, hasCallEnded: true }

    default:
        return state
    }
}
