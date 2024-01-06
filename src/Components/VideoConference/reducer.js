export const initialState = {
    userName: "",
    msgDisplay: "",
    roomId: "",
    myPeer: "",
    isScreenShare: false,
    micStatus: "on",
    camStatus: "on",
    myScreenShare: false,
    isWhiteBoard: false,
    isHost: false,
    email: "",
    roomDetail: {},
    remoteAccess: false,
    currentRemoteAccessUser: {}
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
        case "SET_WHITEBOARD":
            return {
                ...state,
                isWhiteBoard: action.whiteboard
            }
        case "SET_MYSCREEN":
            return {
                ...state,
                myScreenShare: action.screen
            }
        case "SET_HOST":
            return {
                ...state,
                isHost: action.host
            }
        case "SET_EMAIL":
            return {
                ...state,
                email: action.email
            }
        case "SET_ROOMDETAIL":
            return {
                ...state,
                roomDetail: action.roomDetail
            }
        case "SET_REMOTEACCESS":
            return {
                ...state,
                remoteAccess: action.remoteAccess
            }
        case "SET_CURRENTREMOTEACCESSUSER":
            return {
                ...state,
                currentRemoteAccessUser: action.remoteAccess
            }
        default:
            return state;
    }
};

export default reducer;
