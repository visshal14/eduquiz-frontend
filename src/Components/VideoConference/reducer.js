export const initialState = {
    userName: "",
    msgDisplay: "",
    roomId: ""
    // playlists:null,
    //   Remove after developing
    // token: "BQCJh6Hm2jZrv74v6BDGQCv7m78zjZPzgkkbv1WwRQymXxxaOPmLKGpn6dSzOHjirB3sNcVkr41zsIsMVIL_KobNHpYqPr3Y0cQyy4B9WXZkQeI4FtBfr1b4eBHnpXtfbM-dwjpnoe22jgZkccaV-maw9dHxyvn4C1Wp8SPwt3TnV1XH",
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
        default:
            return state;
    }
};

export default reducer;
