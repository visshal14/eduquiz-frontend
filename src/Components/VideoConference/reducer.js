export const initialState = {
    userName: "",
    msgDisplay: "",
    roomId: "",
    myPeer: "",
    isScreenShare: false,
    micStatus: "on",
    camStatus: "on",
    myScreenShare: false
};

const reducer = (state, action) => {


    switch (action.type) {
        case "SET_PEER":
            return {
                ...state,
                myPeer: action.peer
            }
        case "SET_NAME":
            return {
                ...state,
                userName: action.userName,
            };
        case "SET_MSGDIS":
            return {
                ...state,
                msgDisplay: action.msgDis
            }
        case "SET_ROOMID":
            return {
                ...state,
                roomId: action.roomId
            }

        case "SET_SCREENSHARE":
            return {
                ...state,
                isScreenShare: action.screenShare
            }
        case "SET_MICSTATUS":
            return {
                ...state,
                micStatus: action.mic
            }
        case "SET_CAMSTATUS":
            return {
                ...state,
                camStatus: action.mic
            }
        // case "SET_SCREENSTATUS":
        //     return {
        //         ...state,
        //         isScreenShare: action.screen
        //     }
        case "SET_MYSCREEN":
            return {
                ...state,
                myScreenShare: action.screen
            }
        default:
            return state;
    }
};

export default reducer;
