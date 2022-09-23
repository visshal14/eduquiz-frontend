export const initialState = {
    userName: "",
    msgDisplay: "",
    roomId: "",
    myPeer: "",
    isScreenShare: false,
    micStatus: "on"

};

const reducer = (state, action) => {


    switch (action.type) {
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
        case "SET_PEER":
            return {
                ...state,
                myPeer: action.peer
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
        default:
            return state;
    }
};

export default reducer;
