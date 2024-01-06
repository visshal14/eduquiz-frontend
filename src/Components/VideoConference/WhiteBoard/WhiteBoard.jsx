import React, { useEffect, useLayoutEffect, useState } from 'react'
import "./WhiteBoard.css"
// import $ from 'jquery';
import { Create, CropSquare, PanoramaFishEye, Clear, Undo, Redo, ModeEditOutline, NearMe, AutoFixNormal, StarBorderPurple500 } from '@mui/icons-material/';
import { useDataLayerValue } from "../DataLayer"
import rough from "roughjs/bundled/rough.esm";
import { v4 as uuid } from 'uuid';



const generator = rough.generator();


const WhiteBoard = ({ topElement }) => {


    const { remoteStreams, canvasRef, elements, setElements, newElementsToOther, imageArray, setImageArray, updateElementsToOther, socket, isHost, newImageToserver } = useDataLayerValue()

    const [myElements, setMyElements] = useState([])
    const [strokeType, setStrokeType] = useState("line")
    const [eleHistory, setEleHistory] = useState([])
    const [strokeWidth, setStrokeWidth] = useState("5")
    const [canvasWidth, setCanvasWidth] = useState(document.getElementById("whiteboardComp")?.clientWidth)
    const [currentColor, setCurrentColor] = useState("#000000")
    // const [imageArray, setImageArray] = useState([])
    const [ifImageSelected, setIfImageSelected] = useState({ is: false, id: "" })
    const [imagePath, setImagePath] = useState([])

    useEffect(() => {
        // canvas always be on 16:9 ratio for any screen ratio
        const canvas = canvasRef.current

        var ctx = canvas.getContext("2d");
        ctx.scale(2, 2);


        canvasWidthHeight()
        //functio to get width and height to 16:9 ratio
        function canvasWidthHeight() {

            let tempWidth = document.getElementById("top_div").clientWidth
            let tempHeight = tempWidth * 9 / 16;

            let topDivHeight = document.getElementById("top_div").clientHeight

            if (tempHeight < topDivHeight) {
                canvas.width = tempWidth
                setCanvasWidth(canvas.width)
                canvas.height = tempHeight;
                document.getElementById("myCanvas").style.height = canvas.height + "px"
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            } else {
                canvas.height = topDivHeight
                canvas.width = canvas.height * 16 / 9;
                setCanvasWidth(canvas.width)
                document.getElementById("myCanvas").style.height = canvas.height + "px"
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
        }






        if (document.getElementById("whiteboardComp").parentNode.id === "top_div") {
            canvasWidthHeight()
            document.getElementsByClassName("toolbox")[0].style.display = "initial"
        } else {
            canvas.width = document.getElementById("bottom_div").clientWidth
            setCanvasWidth(canvas.width)
            canvas.height = canvas.width * 9 / 16;
            document.getElementById("myCanvas").style.height = canvas.height + "px"
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            document.getElementsByClassName("toolbox")[0].style.display = "none"
        }


        // eslint-disable-next-line
    }, [topElement])


    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {


        function handleResize() {

            setWindowWidth(window.innerWidth)
            let top_divHeight = document.getElementById("top_div").clientHeight
            const canvas = canvasRef.current
            var ctx = canvas.getContext("2d");



            // console.log("54")
            let tempcanvasWidth = document.getElementById("top_div").clientWidth

            // let tempcanvasWidth = document.getElementById("whiteboardComp").clientWidth
            let tempCanvasHeight = tempcanvasWidth * 9 / 16

            canvas.width = tempcanvasWidth
            canvas.height = tempCanvasHeight
            document.getElementById("myCanvas").style.height = canvas.height + "px"

            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // checkCanvasHeight()

            if (top_divHeight < canvas.height) {
                canvas.height = document.getElementById("top_div").clientHeight
                canvas.width = canvas.height * 16 / 9;
                setCanvasWidth(canvas.width)
                document.getElementById("myCanvas").style.height = canvas.height + "px"
                ctx.fillStyle = "#fff";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
            setCanvasWidth(canvas.width)


        }

        window.addEventListener("resize", handleResize);
        handleResize();
        return () => window.removeEventListener("resize", handleResize);
        // eslint-disable-next-line
    }, [])



    //for putting whiteboard element
    useLayoutEffect(() => {


        let tempImageSet2 = new Set()


        elements.forEach((ele) => {
            if (ele.element === "image")
                tempImageSet2.add(JSON.stringify({ id: ele.eleID, x1: ele.x1, y1: ele.y1, x2: ele.width, y2: ele.height }))
        })

        //start ---- beta on image 
        let letImagePath1 = []
        tempImageSet2.forEach((ele) => {
            let path = new Path2D()
            ele = JSON.parse(ele)
            path.rect(ele.x1, ele.y1, ele.x2, ele.y2)
            canvasRef.current.getContext("2d").fill(path);
            letImagePath1.push({ path: path, id: ele.id })


        })
        setImagePath(letImagePath1)

        //end


        const roughCanvas = rough.canvas(canvasRef.current);
        const canvas = canvasRef.current
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.strokeStyle = "#000000";


        elements.forEach((ele, i) => {

            const widthRatio = canvasWidth / ele.canvasWidth
            if (ele.element === "line") {
                ctx.beginPath()
                ctx.moveTo(ele.offsetX * widthRatio, ele.offsetY * widthRatio)
                ctx.lineTo(ele.width * widthRatio, ele.height * widthRatio);
                ctx.lineWidth = ele.strokeWidth * widthRatio || 5;
                ctx.strokeStyle = ele.stroke
                ctx.stroke();
                ctx.closePath()

                // roughCanvas.draw(
                //     generator.line(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio, {
                //         stroke: ele.stroke,
                //         roughness: 0,
                //         strokeWidth: ele.strokeWidth * widthRatio || 5,
                //     })
                // );

            } else if (ele.element === "rect") {

                ctx.beginPath();
                ctx.rect(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio);
                ctx.lineWidth = ele.strokeWidth * widthRatio || 5;
                ctx.strokeStyle = ele.stroke
                ctx.stroke();
                ctx.closePath()


                // roughCanvas.draw(
                //     generator.rectangle(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio, {
                //         stroke: ele.stroke,
                //         roughness: 0,
                //         strokeWidth: ele.strokeWidth * widthRatio || 5,
                //     })
                // );
            } else if (ele.element === "pencil") {
                let tempPath = []
                ele.path.map((x) => (
                    tempPath = [...tempPath, [x[0] * widthRatio, x[1] * widthRatio]]
                ))
                // console.log(tempPath)
                roughCanvas.linearPath(tempPath, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: ele.strokeWidth * widthRatio || 5,
                });
            } else if (ele.element === "circle") {


                ctx.beginPath();
                ctx.arc(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.radius * widthRatio, 0, 2 * Math.PI);
                ctx.lineWidth = ele.strokeWidth * widthRatio || 5;
                ctx.strokeStyle = ele.stroke
                ctx.stroke();
                ctx.closePath()


                // roughCanvas.circle(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.radius * widthRatio, {
                //     stroke: ele.stroke,
                //     roughness: 0,
                //     strokeWidth: ele.strokeWidth * widthRatio || 5,
                // });
            } else if (ele.element === "ellipse") {
                roughCanvas.ellipse(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: ele.strokeWidth * widthRatio || 5,
                });
            } else if (ele.element === "eraser") {
                let tempPath = []
                ele.path.map((x) => (
                    tempPath = [...tempPath, [x[0] * widthRatio, x[1] * widthRatio]]
                ))

                roughCanvas.linearPath(tempPath, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: ele.strokeWidth * widthRatio || 5,
                });

            } else if (ele.element === "fourSidesStar") {
                fourSidesStarFunction(ele.height * widthRatio, ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.strokeWidth * widthRatio)
            } else if (ele.element === "fourSidesStar2") {
                fourStar2Function(ele.x1 * widthRatio, ele.y1 * widthRatio, ele.x2 * widthRatio, ele.y2 * widthRatio, ele.strokeWidth * widthRatio)
            } else if (ele.element === "image") {
                // var myCanvas = canvasRef.current; // Creates a canvas object
                // var myContext = myCanvas.getContext("2d"); // Creates a contect object

                imageArray.forEach((x) => {


                    if (x.currentId === ele.eleID) {
                        // console.log("currentId")


                        let myImage = new Image()
                        myImage.src = x.data

                        myImage.onload = function (ev) {
                            // console.log(myImage)
                            ctx.drawImage(myImage, ele.x1 * widthRatio, ele.y1 * widthRatio, ele.width * widthRatio, ele.height * widthRatio); // Draws the image on canvas
                        }

                    }
                })

            }
        })


        // console.log(roughCanvas)
        // eslint-disable-next-line
    }, [remoteStreams, elements, canvasWidth, windowWidth, topElement, imageArray])





    const [isDrawing, setIsDrawing] = useState(false)
    const [currentEleId, setCurrentEleId] = useState()



    const mouseDown = (e) => {

        if (!isHost) {
            return
        }

        const { offsetX, offsetY } = e.nativeEvent
        setIsDrawing(true)
        const currentId = uuid().slice(0, 8)
        setCurrentEleId(currentId)
        let tempEleForSocket = {}

        if (strokeType === "select") {

            checkIfPointInPath(offsetX, offsetY)


        } else if (strokeType === "line") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, stroke: currentColor, element: "line", strokeWidth: strokeWidth, eleID: currentId },
            ]);
            tempEleForSocket = { offsetX, offsetY, stroke: currentColor, element: "line", strokeWidth: strokeWidth, eleID: currentId }
        } else if (strokeType === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: currentColor,
                    element: "pencil",
                    strokeWidth: strokeWidth,
                    canvasWidth: canvasWidth, eleID: currentId
                },
            ]);
            tempEleForSocket = {
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: currentColor,
                element: "pencil",
                strokeWidth: strokeWidth,
                canvasWidth: canvasWidth, eleID: currentId
            }
        }
        else if (strokeType === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, stroke: currentColor, element: "rect", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ]);
            tempEleForSocket = { offsetX, offsetY, stroke: currentColor, element: "rect", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
        } else if (strokeType === "circle") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, radius: 0, stroke: currentColor, element: "circle", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ])
            tempEleForSocket = { offsetX, offsetY, radius: 0, stroke: currentColor, element: "circle", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
        } else if (strokeType === "ellipse") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, width: 0, height: 0, stroke: currentColor, element: "ellipse", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ])
            tempEleForSocket = { offsetX, offsetY, width: 0, height: 0, stroke: currentColor, element: "ellipse", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }

        } else if (strokeType === "eraser") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: "#fff",
                    element: "eraser", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId
                },
            ]);
            tempEleForSocket = {
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: "#fff",
                element: "eraser", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId
            }
        } else if (strokeType === "fourSidesStar") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    offsetX,
                    offsetY,
                    height: 0,
                    stroke: currentColor,
                    element: "fourSidesStar",
                    strokeWidth: strokeWidth,
                    canvasWidth: canvasWidth,
                    eleID: currentId
                },
            ]);
            tempEleForSocket = {
                offsetX,
                offsetY,
                height: 0,
                stroke: currentColor,
                element: "fourSidesStar",
                strokeWidth: strokeWidth,
                canvasWidth: canvasWidth,
                eleID: currentId
            }
        } else if (strokeType === "fourSidesStar2") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    x1: offsetX,
                    y1: offsetY,
                    x2: offsetX,
                    y2: offsetY,
                    stroke: currentColor,
                    element: "fourSidesSta2r",
                    strokeWidth: strokeWidth,
                    canvasWidth: canvasWidth,
                    eleID: currentId
                },
            ]);
            tempEleForSocket = {
                x1: offsetX,
                y1: offsetY,
                x2: offsetX,
                y2: offsetY,
                stroke: currentColor,
                element: "fourSidesSta2r",
                strokeWidth: strokeWidth,
                canvasWidth: canvasWidth,
                eleID: currentId
            }
        }

        newElementsToOther(tempEleForSocket, setElements)
    }

    const [isShiftPressed, setIsShift] = useState(false)
    const mouseMove = (e) => {

        if (!isHost) {
            return
        }


        eraserCursor(e)
        e = e.nativeEvent
        if (!isDrawing) {
            return;
        }
        let tempEleForUpdateSocket = {}
        if (strokeType === "select" && ifImageSelected.is === true) {

            // console.log("updated")

            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    // index === elements.length - 1
                    ele.eleID === ifImageSelected.id
                        ? {
                            x1: e.offsetX,
                            y1: e.offsetY,
                            width: ele.width,
                            height: ele.height,

                            element: "image",

                            canvasWidth: canvasWidth,
                            eleID: ele.eleID
                        }
                        : ele
                )
            );

            tempEleForUpdateSocket = {
                element: "image",
                x1: e.offsetX,
                y1: e.offsetY,
                canvasWidth: canvasWidth,
                eleID: ifImageSelected.id
            }




        } else if (strokeType === "line") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    // index === elements.length - 1
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: e.offsetX,
                            height: e.offsetY,
                            stroke: ele.stroke,
                            element: "line",
                            strokeWidth: ele.strokeWidth,
                            canvasWidth: canvasWidth,
                            eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "line", width: e.offsetX, height: e.offsetY, canvasWidth: canvasWidth, eleID: currentEleId }
        } else if (strokeType === "rect") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: e.offsetX - ele.offsetX,
                            height: e.offsetY - ele.offsetY,
                            stroke: ele.stroke,
                            element: "rect",
                            strokeWidth: ele.strokeWidth,
                            canvasWidth: canvasWidth,
                            eleID: ele.eleID
                        }
                        : ele
                )
            )
            tempEleForUpdateSocket = { element: "rect", width: e.offsetX, height: e.offsetY, canvasWidth: canvasWidth, eleID: currentEleId }


        } else if (strokeType === "pencil") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            path: [...ele.path, [e.offsetX, e.offsetY]],
                            stroke: ele.stroke,
                            element: ele.element,
                            strokeWidth: ele.strokeWidth, canvasWidth: canvasWidth, eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "pencil", pathX: e.offsetX, pathY: e.offsetY, canvasWidth: canvasWidth, eleID: currentEleId }
        } else if (strokeType === "circle") {
            const tempEl = elements[elements.length - 1]
            const d = Math.sqrt((tempEl.offsetX - e.offsetX) * (tempEl.offsetX - e.offsetX) + (tempEl.offsetY - e.offsetY) * (tempEl.offsetY - e.offsetY))
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            radius: d * 2,
                            stroke: ele.stroke,
                            element: ele.element,
                            strokeWidth: ele.strokeWidth, canvasWidth: canvasWidth, eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "circle", radius: d * 2, canvasWidth: canvasWidth, eleID: currentEleId }
            // roughCanvas.circle(480, 50, 80);
        } else if (strokeType === "ellipse") {
            const tempEl = elements[elements.length - 1]
            let tempWidth = (e.offsetX - tempEl.offsetX) * 2
            let tempHeight = (e.offsetY - tempEl.offsetY) * 2

            if (isShiftPressed) {
                let h = Math.sqrt((tempEl.offsetX - e.offsetX) * (tempEl.offsetX - e.offsetX) + (tempEl.offsetY - e.offsetY) * (tempEl.offsetY - e.offsetY)) * 2;

                tempWidth = h / Math.sqrt(2)
                tempHeight = tempWidth
                // tempHeight = Math.sqrt((tempEl.offsetX - e.offsetX) * (tempEl.offsetX - e.offsetX) + (tempEl.offsetY - e.offsetY) * (tempEl.offsetY - e.offsetY)) * 2;

            }
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            width: tempWidth,
                            height: tempHeight,
                            stroke: ele.stroke,
                            element: ele.element,
                            strokeWidth: ele.strokeWidth, canvasWidth: canvasWidth, eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "ellipse", width: tempWidth, height: tempHeight, canvasWidth: canvasWidth, eleID: currentEleId }
        } else if (strokeType === "eraser") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            path: [...ele.path, [e.offsetX, e.offsetY]],
                            stroke: ele.stroke,
                            element: ele.element,
                            strokeWidth: ele.strokeWidth, canvasWidth: canvasWidth, eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "eraser", pathX: e.offsetX, pathY: e.offsetY, canvasWidth: canvasWidth, eleID: currentEleId }
        } else if (strokeType === "fourSidesStar") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            offsetX: ele.offsetX,
                            offsetY: ele.offsetY,
                            height: e.offsetX - ele.offsetX,
                            stroke: "black",
                            element: "fourSidesStar",
                            strokeWidth: ele.strokeWidth,
                            canvasWidth: canvasWidth,
                            eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "fourSidesStar", height: e.offsetX, canvasWidth: canvasWidth, eleID: currentEleId }
        } else if (strokeType === "fourSidesStar2") {
            setElements((prevElements) =>
                prevElements.map((ele, index) =>
                    ele.eleID === currentEleId
                        ? {
                            x1: ele.x1,
                            y1: ele.y1,
                            x2: e.offsetX,
                            y2: e.offsetY,
                            stroke: "black",
                            element: "fourSidesStar2",
                            strokeWidth: ele.strokeWidth,
                            canvasWidth: canvasWidth,
                            eleID: ele.eleID
                        }
                        : ele
                )
            );
            tempEleForUpdateSocket = { element: "fourSidesStar2", x2: e.offsetX, y2: e.offsetY, canvasWidth: canvasWidth, eleID: currentEleId }
        }




        updateElementsToOther(tempEleForUpdateSocket, tempEleForUpdateSocket.element === "image" ? ifImageSelected.id : currentEleId, setElements, tempEleForUpdateSocket.element)

    }

    useEffect(() => {
        socket.on("newImageToClient", (data, id) => {

            setImageArray((prev) => [...prev, {
                currentId: id,
                data: data
            }])




        })
        // eslint-disable-next-line
    }, [])

    //socket update
    useEffect(() => {




        socket.on("updateElementToSocketUsers", (updatedElement, currentId, elementType) => {
            // console.log("updateElementToSocketUsers 29    " + elementType + "   " + currentId)

            if (elementType === "image") {

                // console.log(updatedElement, "  ", currentId, "  ", elementType)

                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ?
                            {
                                x1: updatedElement.x1,
                                y1: updatedElement.y1,
                                width: ele.width,
                                height: ele.height,

                                element: "image",

                                canvasWidth: updatedElement.canvasWidth,
                                eleID: updatedElement.eleID,
                            }
                            : ele
                    )
                );


            } else if (elementType === "line") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ?
                            {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                width: updatedElement.width,
                                height: updatedElement.height,
                                stroke: ele.stroke,
                                element: "line",
                                strokeWidth: ele.strokeWidth,
                                canvasWidth: updatedElement.canvasWidth,
                                eleID: updatedElement.eleID,
                            }
                            : ele
                    )
                );
            } else if (elementType === "rect") {
                // console.log(updatedElement)
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                width: updatedElement.width - ele.offsetX,
                                height: updatedElement.height - ele.offsetY,
                                stroke: ele.stroke,
                                element: "rect",
                                strokeWidth: ele.strokeWidth,
                                canvasWidth: updatedElement.canvasWidth,
                                eleID: updatedElement.eleID
                            }
                            : ele
                    )
                )
            } else if (elementType === "pencil") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                path: [...ele.path, [updatedElement.pathX, updatedElement.pathY]],
                                stroke: ele.stroke,
                                element: ele.element,
                                strokeWidth: ele.strokeWidth, canvasWidth: updatedElement.canvasWidth, eleID: updatedElement.eleID
                            }
                            : ele
                    )
                );
            } else if (elementType === "circle") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                radius: updatedElement.radius,
                                stroke: ele.stroke,
                                element: ele.element,
                                strokeWidth: ele.strokeWidth,
                                canvasWidth: updatedElement.canvasWidth,
                                eleID: updatedElement.eleID
                            }
                            : ele
                    )
                );
            } else if (elementType === "ellipse") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                width: updatedElement.width,
                                height: updatedElement.height,
                                stroke: ele.stroke,
                                element: ele.element,
                                strokeWidth: ele.strokeWidth, canvasWidth: updatedElement.canvasWidth, eleID: updatedElement.eleID
                            }
                            : ele
                    )
                );
            } else if (elementType === "eraser") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                path: [...ele.path, [updatedElement.pathX, updatedElement.pathY]],
                                stroke: ele.stroke,
                                element: ele.element,
                                strokeWidth: ele.strokeWidth, canvasWidth: updatedElement.canvasWidth, eleID: updatedElement.eleID
                            }
                            : ele
                    )
                );
            } else if (elementType === "fourSidesStar") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                offsetX: ele.offsetX,
                                offsetY: ele.offsetY,
                                height: updatedElement.height - ele.offsetX,
                                stroke: "black",
                                element: "fourSidesStar",
                                strokeWidth: ele.strokeWidth,
                                canvasWidth: canvasWidth,
                                eleID: ele.eleID
                            }
                            : ele
                    )
                );
            }
            else if (elementType === "fourSidesStar2") {
                setElements((prevElements) =>
                    prevElements.map((ele, index) =>
                        ele.eleID === currentId
                            ? {
                                x1: ele.offsetX,
                                y1: ele.offsetY,
                                x2: updatedElement.x2,
                                y2: updatedElement.y2,
                                stroke: "black",
                                element: "fourSidesStar",
                                strokeWidth: ele.strokeWidth,
                                canvasWidth: canvasWidth,
                                eleID: ele.eleID
                            }
                            : ele
                    )
                );
            }

        })
        socket.on("newElementsToSocketUsers", (elements) => {
            // console.log("new element  ")
            // console.log(elements)
            setElements((prev) => [...prev, elements])
        })
        socket.on("undoToSocketUsers", (elementId) => {
            setElements((prev) =>
                prev.filter((ele, i) => ele.eleID !== elementId)
            )
        })
        socket.on("redoToSocketUsers", (element) => {
            setElements((prev) => [...prev, element]);
        })
        // eslint-disable-next-line
    }, [])


    const fourStar2Function = (x1, y1, x2, y2, strokeWidth) => {
        //1
        let height = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        const roughCanvas = rough.canvas(canvasRef.current);
        console.log(height)
        let base = parseFloat((height / (2 * (1 + Math.tan(Math.PI / 6)))).toFixed(2))
        let perpen = parseFloat((base * Math.tan(Math.PI / 6).toFixed(2)).toFixed(2))

        //line 1
        let line1_X1 = x1
        let line1_Y1 = y1
        let line1_X2 = line1_X1 + perpen
        let line1_Y2 = line1_Y1 + base

        roughCanvas.draw(
            generator.line(line1_X1, line1_Y1, line1_X2, line1_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );

        //line 2
        let line2_X1 = line1_X2
        let line2_Y1 = line1_Y2
        let line2_X2 = line2_X1 + base
        let line2_Y2 = line2_Y1 + perpen

        roughCanvas.draw(
            generator.line(line2_X1, line2_Y1, line2_X2, line2_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );

        //line 3
        let line3_X1 = line2_X2
        let line3_Y1 = line2_Y2
        let line3_X2 = line2_X2 - base
        let line3_Y2 = line2_Y2 + perpen

        roughCanvas.draw(
            generator.line(line3_X1, line3_Y1, line3_X2, line3_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );
        //line 4
        let line4_X1 = line3_X2
        let line4_Y1 = line3_Y2
        let line4_X2 = line3_X2 - perpen
        let line4_Y2 = line3_Y2 + base

        roughCanvas.draw(
            generator.line(line4_X1, line4_Y1, line4_X2, line4_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );

        //line 5
        let line5_X1 = line4_X2
        let line5_Y1 = line4_Y2
        let line5_X2 = line4_X2 - perpen
        let line5_Y2 = line4_Y2 - base

        roughCanvas.draw(
            generator.line(line5_X1, line5_Y1, line5_X2, line5_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );

        //line 6
        let line6_X1 = line5_X2
        let line6_Y1 = line5_Y2
        let line6_X2 = line5_X2 - base
        let line6_Y2 = line5_Y2 - perpen

        roughCanvas.draw(
            generator.line(line6_X1, line6_Y1, line6_X2, line6_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );


        //line 7
        let line7_X1 = line6_X2
        let line7_Y1 = line6_Y2
        let line7_X2 = line6_X2 + base
        let line7_Y2 = line6_Y2 - perpen

        roughCanvas.draw(
            generator.line(line7_X1, line7_Y1, line7_X2, line7_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );

        //line 7
        let line8_X1 = line7_X2
        let line8_Y1 = line7_Y2
        let line8_X2 = line7_X2 + perpen
        let line8_Y2 = line7_Y2 - base

        roughCanvas.draw(
            generator.line(line8_X1, line8_Y1, line8_X2, line8_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );


    }


    const fourSidesStarFunction = (heightSide, a, b, strokeWidth) => {
        //500 100 - 500*hypto 100 
        let line1_X1 = a //y1 to y2 = base
        let line1_Y1 = b
        // to change height
        let b_1 = line1_Y1 + heightSide //base
        let p_1 = (b_1 - line1_Y1) * Math.tan(Math.PI / 6)
        let line1_X2 = line1_X1 + ~~p_1
        let line1_Y2 = b_1
        // console.log(`${line1_X1} ${line1_Y1} - ${line1_X2} ${line1_Y2}`)
        //1
        const roughCanvas = rough.canvas(canvasRef.current);
        roughCanvas.draw(
            generator.line(line1_X1, line1_Y1, line1_X2, line1_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );




        //2
        let line2_X1 = line1_X2
        let line2_Y1 = line1_Y2
        let p_2 = (line1_X2 - line1_X1)

        let b_2 = p_2 / (Math.tan(Math.PI / 6))

        let line2_X2 = line2_X1 + ~~b_2
        let line2_Y2 = line1_Y2 + ~~p_2

        roughCanvas.draw(
            generator.line(line2_X1, line2_Y1, line2_X2, line2_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );
        //3
        let line3_X1 = line2_X2
        let line3_Y1 = line2_Y2
        let line3_X2 = line2_X1
        let line3_Y2 = line2_Y1 + ~~p_2 * 2
        roughCanvas.draw(
            generator.line(line3_X1, line3_Y1, line3_X2, line3_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );


        //4
        let line4_X1 = line3_X2
        let line4_Y1 = line3_Y2
        let p_4 = (line1_X2 - line1_X1)
        // console.log(p_2)
        let b_4 = p_4 / (Math.tan(Math.PI / 6))
        // console.log(b_4)
        let line4_X2 = line4_X1 - (line1_X2 - line1_X1)

        let line4_Y2 = line4_Y1 + ~~b_4
        // console.log(`${line4_X1} ${line4_Y1} - ${line4_X2} ${line4_Y2}`)
        roughCanvas.draw(
            generator.line(line4_X1, line4_Y1, line4_X2, line4_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );





        //5
        let line5_X1 = line4_X2
        let line5_Y1 = line4_Y2
        let line5_X2 = line4_X2 - (line1_X2 - line1_X1)
        let line5_Y2 = line4_Y1

        roughCanvas.draw(
            generator.line(line5_X1, line5_Y1, line5_X2, line5_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );


        //6
        let line6_X1 = line5_X2
        let line6_Y1 = line5_Y2
        let p_6 = (line1_X2 - line1_X1)

        let b_6 = p_2 / (Math.tan(Math.PI / 6))

        let line6_X2 = line6_X1 - ~~b_6
        let line6_Y2 = line6_Y1 - ~~p_6

        roughCanvas.draw(
            generator.line(line6_X1, line6_Y1, line6_X2, line6_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );
        //7
        let line7_X1 = line6_X2
        let line7_Y1 = line6_Y2
        let line7_X2 = line6_X1
        let line7_Y2 = line6_Y1 - ~~p_2 * 2
        roughCanvas.draw(
            generator.line(line7_X1, line7_Y1, line7_X2, line7_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );
        //8
        let line8_X1 = line1_X1
        let line8_Y1 = line1_Y1
        let line8_X2 = line1_X1 - (line1_X2 - line1_X1)
        let line8_Y2 = line1_Y2
        roughCanvas.draw(
            generator.line(line8_X1, line8_Y1, line8_X2, line8_Y2, {
                stroke: "black",
                roughness: 0,
                strokeWidth: strokeWidth || 5,
            })
        );


    }



    const eraserCursor = (e) => {
        document.documentElement.style.setProperty('--x', (e?.clientX + window.scrollX) + 'px');
        document.documentElement.style.setProperty('--y', (e?.clientY + window.scrollY) + 'px');
        document.documentElement.style.setProperty('--h', (strokeWidth) + 'px');
        if (strokeType === "eraser") {
            document.getElementById("myCanvas").style.cursor = "none"
            document.getElementById("circularcursor").style.display = "block"
        } else {
            document.getElementById("myCanvas").style.cursor = "crosshair"
            document.getElementById("circularcursor").style.display = "none"
        }
    }
    const mouseUp = (e) => {
        if (!isHost) {
            return
        }

        setIsDrawing(false)
        eraserCursor()
        myElementsUpdater()

    }
    const myElementsUpdater = () => {
        setMyElements((prev) => [...prev, elements[elements.length - 1]])
    }
    const clearWhiteBoard = () => {
        const canvas = canvasRef.current
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        setElements([])
    }

    const undoWhiteBoard = () => {
        if (elements.length > 0) {
            socket.emit("undoToSocketServer", myElements[myElements.length - 1].eleID)
            setEleHistory((prev) => [...prev, myElements[myElements.length - 1]]);
            setElements((prev) =>
                prev.filter((ele, i) => ele.eleID !== myElements[myElements.length - 1].eleID)
            )
            setMyElements((prev) =>
                prev.filter((ele, i) => i !== myElements.length - 1)
            )
        }
    }
    const redoWhiteBoard = () => {
        if (eleHistory.length > 0) {
            socket.emit("redoToSocketServer", eleHistory[eleHistory.length - 1])
            setElements((prev) => [...prev, eleHistory[eleHistory.length - 1]]);
            setMyElements((prev) => [...prev, eleHistory[eleHistory.length - 1]]);
            setEleHistory((prev) =>
                prev.filter((ele, i) => i !== eleHistory.length - 1)
            );
        }

    }
    window.addEventListener("keydown", (e) => {
        if (e.key === "Shift") {

            setIsShift(true)
        } else {
            setIsShift(false)
        }
    });
    window.addEventListener("keyup", (e) => {
        if (e.key === "Shift") {
            // console.log("shift up")
            setIsShift(false)
        }
    });




    useEffect(() => {

        let tempImageArray1 = imageArray
        let tempImageSet = new Set()
        if (tempImageArray1.length < 2) return


        let id = ""

        tempImageArray1?.forEach((ele, i) =>
            tempImageSet.add(ele.currentId)
        )






        if (tempImageSet.length === tempImageArray1.length) return


        tempImageArray1.forEach((ele, i) => {
            if (ele.currentId !== id) {
                id = ele.currentId
            } else {
                tempImageArray1.splice(i, 1)
            }
        })

        setImageArray(tempImageArray1)


        // eslint-disable-next-line
    }, [imageArray])





    const checkIfPointInPath = (x, y) => {

        imagePath.forEach((path, index) => {

            if (canvasRef.current.getContext("2d").isPointInPath(path.path, x, y)) {
                // console.log(true);
                setIfImageSelected({ is: true, id: path.id })
            } else {
                setIfImageSelected({ is: false, id: "" })
            }
        });
    }


    //beta - image on whitboard
    // eslint-disable-next-line
    const inputImage = (e) => {
        if (e.target.files) {
            let imageFile = e.target.files[0]; //here we get the image file
            var reader = new FileReader();
            reader.readAsDataURL(imageFile);
            reader.onloadend = function (e) {
                var myImage = new Image(); // Creates image object
                myImage.src = e.target.result; // Assigns converted image to image object
                myImage.onload = function (ev) {

                    const currentId = uuid().slice(0, 8)
                    setCurrentEleId(currentId)
                    setElements((prevElements) => [
                        ...prevElements,
                        {
                            x1: 0,
                            y1: 0,
                            width: 300,
                            height: 300 * myImage.height / myImage.width,
                            // x2: offsetX,
                            // y2: offsetY,
                            element: "image",
                            eleID: currentId,
                            canvasWidth: canvasWidth
                        },
                    ]);
                    let tempEleForSocket = {
                        x1: 0,
                        y1: 0,
                        width: 300,
                        height: 300 * myImage.height / myImage.width,
                        // x2: offsetX,
                        // y2: offsetY,
                        element: "image",
                        eleID: currentId,
                        canvasWidth: canvasWidth
                    }

                    setImageArray((prevElements) => [
                        ...prevElements,
                        {
                            currentId: currentId,
                            data: myImage.src
                        }
                    ]);

                    // setImageArray((...prev) => [prev, {
                    //     currentId: currentId,
                    //     data: myImage
                    // }])

                    newElementsToOther(tempEleForSocket, setElements)
                    newImageToserver(myImage, currentId)

                    // var myCanvas = canvasRef.current; // Creates a canvas object
                    // var myContext = myCanvas.getContext("2d"); // Creates a contect object

                    // myContext.drawImage(myImage, 0, 0, 300, 300 * myImage.height / myImage.width); // Draws the image on canvas

                }
            }
        }
    }



    return (
        <div className='whiteboard-home' id="whiteboard">
            <div style={{ display: "none" }} id="circularcursor"></div>

            <canvas ref={canvasRef} id="myCanvas"
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp}
            >
            </canvas>

            <div className='toolbox'>
                <ul>
                    <li data-text="select" ><NearMe onClick={() => {
                        setStrokeType("select")
                    }} /></li>
                    <li data-text="Line" ><Create onClick={() => { setStrokeType("line") }} /></li>
                    <li data-text="Rectangle"><CropSquare onClick={() => { setStrokeType("rect") }} /></li>
                    <li data-text="Circle"><PanoramaFishEye onClick={() => { setStrokeType("circle") }} /></li>
                    <li data-text="Ellipse"><PanoramaFishEye onClick={() => { setStrokeType("ellipse") }} /></li>
                    <li data-text="Pencil"><ModeEditOutline onClick={() => { setStrokeType("pencil") }} /></li>
                    <li data-text="Eraser"><AutoFixNormal onClick={() => { setStrokeType("eraser") }} /></li>
                    {/* version 1 */}
                    <li data-text="Four Sides Star"><StarBorderPurple500 onClick={() => { setStrokeType("fourSidesStar") }} /></li>
                    {/* version 2 */}
                    <li data-text="Four Sides Star"><StarBorderPurple500 onClick={() => { setStrokeType("fourSidesStar2") }} /></li>
                    <li data-text="Clear WhiteBoard"><Clear onClick={clearWhiteBoard} /></li>
                    <li data-text="Undo"><Undo onClick={undoWhiteBoard} /></li>
                    <li data-text="Redo"><Redo onClick={redoWhiteBoard} /></li>
                    <li data-text="Stoke =  5px"><Clear onClick={() => { setStrokeWidth("5") }} /></li>
                    <li data-text="Stoke =  10px"><Clear onClick={() => { setStrokeWidth("10") }} /></li>
                    <li data-text="Choose Color"><input type="color" id="colorChoice" name="favcolor" onChange={(e) => {
                        setCurrentColor(e.target.value)
                    }} value={currentColor} /></li>
                </ul>
            </div>
        </div>
    )
}
//pen 
// highlighter
// shapes
// eraser
// text
// arrow
// color
// undo redo

export default WhiteBoard
