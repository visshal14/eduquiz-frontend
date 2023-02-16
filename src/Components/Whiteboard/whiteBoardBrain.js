import { io } from "socket.io-client";
// const socket = io.connect("http://localhost:4000", {
//     forceNew: true,
//     transports: ["polling"],
// });
const socket = io.connect("https://eduquiz001.onrender.com", {
    // forceNew: true,
    // transports: ["polling"],
});
const whiteBoardBrain = (roomId) => {
    socket.emit("whiteboard-join", roomId, "id")
    socket.on("whiteboard-user-connected", (userId) => {
        console.log("whiteborad user added")
    })
}
const newElementsToOther = (ele, setElements) => {
    console.log("new 17")
    socket.emit("newElementsToSocketServer", ele)

}

const updateElementsToOther = (ele, elementId, setElements, elementType) => {
    socket.emit("updateElementToSocketServer", ele, elementId, elementType)
}
export { socket, whiteBoardBrain, newElementsToOther, updateElementsToOther }



//when mouse down socket
//mouse move socket
