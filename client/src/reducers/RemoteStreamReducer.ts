import { HANG_UP, RECEIVED_REMOTE_TRACK, TOGGLE_DEAFEN } from "../actions/types";

const initialState = {
    stream: new MediaStream,
    isAvailable: false,
    isDeafened: false,
}

export default (state = initialState, { type, payload }: { type: string, payload: any }) => {
    switch (type) {

    case RECEIVED_REMOTE_TRACK:
        state.stream.addTrack(payload);
        return { ...state, isAvailable: true};

    case HANG_UP:
        return {
            stream: new MediaStream,
            isAvailable: false,
        };
    
    case TOGGLE_DEAFEN:
        return { ...state, isDeafened: !state.isDeafened }

    default:
        return state;
    }
}
