import { HANG_UP, OPEN_CAMERA, OPEN_CAMERA_ERROR, TOGGLE_MUTE, TOGGLE_VIDEO } from "../actions/types"

const initialState = {
    stream: null,
    streamError: false,
    isMuted: false,
    isVideoOff: false,
}

export default (state = initialState, { type, payload }: { type: string, payload: any }) => {
    switch (type) {

    case OPEN_CAMERA:
        return {...state, stream: payload}

    case OPEN_CAMERA_ERROR:
        return {...state, streamError: true}

    case HANG_UP:
        console.log(initialState)
        return initialState;

    case TOGGLE_MUTE:
        // const newIsMuted = state.isMuted === true ? false:true
        return { ...state, isMuted: !state.isMuted }

    case TOGGLE_VIDEO:
        return { ...state, isVideoOff: !state.isVideoOff }

    default:
        return state
    }
}
