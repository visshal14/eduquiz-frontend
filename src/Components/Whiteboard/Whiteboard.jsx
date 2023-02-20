import React, { useEffect, useLayoutEffect, useState } from 'react'
import "./WhiteBoard.css"
// import $ from 'jquery';
import { Create, CropSquare, PanoramaFishEye, Clear, Undo, Redo, ModeEditOutline, AutoFixNormal, StarBorderPurple500 } from '@mui/icons-material/';
import { useRef } from 'react';
import { newElementsToOther, updateElementsToOther, whiteBoardBrain, socket } from './whiteBoardBrain';
import rough from "roughjs/bundled/rough.esm";
import { v4 as uuid } from 'uuid';



const generator = rough.generator();


const Whiteboard = () => {

    const canvasRef = useRef()







    //write on Click-------------------------------
    // useEffect(() => {
    //     const canvas = canvasRef.current
    //     // var myCanvas = document.getElementById("myCanvas");
    //     var ctx = canvas.getContext("2d");

    //     // Fill Window Width and Height
    //     canvas.width = window.innerWidth - 200;
    //     canvas.height = window.innerHeight - 200;


    //     // Set Background Color
    //     ctx.fillStyle = "#fff";
    //     ctx.fillRect(0, 0, canvas.width, canvas.height);

    //     // Mouse Event Handlers
    //     if (canvas) {
    //         var isDown = false;
    //         var canvasX, canvasY;
    //         ctx.lineWidth = 10;

    //         $(canvas).mousedown(function (e) {
    //             console.log(e)
    //             isDown = true;
    //             ctx.beginPath();
    //             canvasX = e.clientX - canvas.offsetLeft;
    //             canvasY = e.clientY - canvas.offsetTop;
    //             ctx.moveTo(canvasX, canvasY);
    //         }).mousemove(function (e) {
    //             if (isDown !== false) {
    //                 canvasX = e.pageX - canvas.offsetLeft;
    //                 canvasY = e.pageY - canvas.offsetTop;
    //                 ctx.lineTo(canvasX, canvasY);
    //                 ctx.strokeStyle = "#000";
    //                 ctx.stroke();
    //             }
    //         }).mouseup(function (e) {
    //             isDown = false;
    //             ctx.closePath();
    //         });
    //     }
    // }, [])


    //shapes ---------------------------

    // useLayoutEffect(() => {
    //     var myCanvas = document.getElementById("myCanvas");
    //     var ctx = myCanvas.getContext("2d");

    //     // Fill Window Width and Height
    //     myCanvas.width = window.innerWidth - 200;
    //     myCanvas.height = window.innerHeight - 200;


    //     // Set Background Color
    //     ctx.fillStyle = "#fff";
    //     ctx.fillRect(0, 0, myCanvas.width, myCanvas.height);
    //     var isDrawing = false
    //     var startX, startY

    //     myCanvas.addEventListener("mousedown", (e) => {
    //         isDrawing = true
    //         startX = e.clientX - myCanvas.offsetLeft
    //         startY = e.clientY - myCanvas.offsetTop

    //         console.log("click")
    //     })
    //     myCanvas.addEventListener("mousemove", (e) => {
    //         console.log("move")
    //         if (isDrawing) {
    //             console.log(`${startX}      ${startY}`)
    //             console.log(`${e.clientX}      ${e.clientY}`)
    //             console.log(`${e.clientX - myCanvas.offsetLeft - startX}      ${e.clientY - myCanvas.offsetLeft - startY}`)

    //             // ctx.fillRect(25, 25, 100, 100);

    //             ctx.strokeStyle = "#000";

    //             // ctx.strokeRect(startX, startY, e.clientX - myCanvas.offsetLeft - startX, e.clientY - myCanvas.offsetLeft - startY);
    //             ctx.strokeRect(startX, startY, e.offsetX - startX, e.offsetY - startY);

    //         }
    //     })
    //     myCanvas.addEventListener("mouseup", (e) => {
    //         isDrawing = false
    //         console.log("up")

    //     })
    // }, [])

    const [elements, setElements] = useState([])
    const [myElements, setMyElements] = useState([])
    const [strokeType, setStrokeType] = useState("fourSidesStar")
    const [eleHistory, setEleHistory] = useState([])
    const [strokeWidth, setStrokeWidth] = useState("5")
    const [canvasWidth, setCanvasWidth] = useState(window.innerWidth - 200)




    useEffect(() => {
        whiteBoardBrain()
        const canvas = canvasRef.current
        // var myCanvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.scale(2, 2);
        // Fill Window Width and Height
        canvas.width = window.innerWidth - 200;
        setCanvasWidth(canvas.width)
        // canvas.height = window.innerHeight - 200;
        canvas.height = canvas.width * 9 / 16;

        document.getElementById("myCanvas").style.height = canvas.height + "px"

        // console.log(canvas.width + "   " + canvas.height)
        // Set Background Color
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // makeGrid()



    }, [])





    window.addEventListener("resize", async (e) => {
        let tempcanvasWidth = window.innerWidth - 200
        let tempCanvasHeight = tempcanvasWidth * 9 / 16
        const canvas = canvasRef.current
        canvas.width = tempcanvasWidth
        canvas.height = tempCanvasHeight
        document.getElementById("myCanvas").style.height = canvas.height + "px"
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        setTimeout(() => {
            setCanvasWidth(tempcanvasWidth)
        }, 1 / 100000000)
    })

    // eslint-disable-next-line
    // const makeGrid = () => {
    //     console.log("make grid")
    //     const canvas = canvasRef.current
    //     var ctx = canvas.getContext("2d");
    //     for (let i = 0; i < canvas.width / 50; i++) {
    //         ctx.beginPath();
    //         ctx.strokeStyle = "#000";
    //         ctx.lineWidth = 0.2
    //         ctx.moveTo(50 * i, 0);
    //         ctx.lineTo(50 * i, canvas.height);
    //         ctx.stroke();
    //     }
    //     for (let i = 0; i < canvas.height / 50; i++) {
    //         ctx.beginPath();
    //         ctx.strokeStyle = "#000";
    //         ctx.lineWidth = 0.2
    //         ctx.moveTo(0, 50 * i);
    //         ctx.lineTo(canvas.width, 50 * i);
    //         ctx.stroke();
    //     }
    // }

    useLayoutEffect(() => {

        // updateElementsToOther(elements, setElements)

        const roughCanvas = rough.canvas(canvasRef.current);
        const canvas = canvasRef.current
        var ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.strokeStyle = "#000";
        // makeGrid()
        elements?.forEach((ele, i) => {
            const widthRatio = canvasWidth / ele.canvasWidth
            if (ele.element === "line") {
                roughCanvas.draw(
                    generator.line(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: ele.strokeWidth * widthRatio || 5,
                    })
                );
            } else if (ele.element === "rect") {
                roughCanvas.draw(
                    generator.rectangle(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.width * widthRatio, ele.height * widthRatio, {
                        stroke: ele.stroke,
                        roughness: 0,
                        strokeWidth: ele.strokeWidth * widthRatio || 5,
                    })
                );
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
                roughCanvas.circle(ele.offsetX * widthRatio, ele.offsetY * widthRatio, ele.radius * widthRatio, {
                    stroke: ele.stroke,
                    roughness: 0,
                    strokeWidth: ele.strokeWidth * widthRatio || 5,
                });
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
            }
        })
    }, [elements, canvasWidth])


    const [isDrawing, setIsDrawing] = useState(false)
    const [currentEleId, setCurrentEleId] = useState()



    const mouseDown = (e) => {
        const { offsetX, offsetY } = e.nativeEvent
        setIsDrawing(true)
        const currentId = uuid().slice(0, 8)
        setCurrentEleId(currentId)
        let tempEleForSocket = {}

        if (strokeType === "line") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, stroke: "black", element: "line", strokeWidth: strokeWidth, eleID: currentId },
            ]);
            tempEleForSocket = { offsetX, offsetY, stroke: "black", element: "line", strokeWidth: strokeWidth, eleID: currentId }
        } else if (strokeType === "pencil") {
            setElements((prevElements) => [
                ...prevElements,
                {
                    offsetX,
                    offsetY,
                    path: [[offsetX, offsetY]],
                    stroke: "blue",
                    element: "pencil",
                    strokeWidth: strokeWidth,
                    canvasWidth: canvasWidth, eleID: currentId
                },
            ]);
            tempEleForSocket = {
                offsetX,
                offsetY,
                path: [[offsetX, offsetY]],
                stroke: "blue",
                element: "pencil",
                strokeWidth: strokeWidth,
                canvasWidth: canvasWidth, eleID: currentId
            }
        }
        else if (strokeType === "rect") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, stroke: "black", element: "rect", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ]);
            tempEleForSocket = { offsetX, offsetY, stroke: "black", element: "rect", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
        } else if (strokeType === "circle") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, radius: 0, stroke: "black", element: "circle", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ])
            tempEleForSocket = { offsetX, offsetY, radius: 0, stroke: "black", element: "circle", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
        } else if (strokeType === "ellipse") {
            setElements((prevElements) => [
                ...prevElements,
                { offsetX, offsetY, width: 0, height: 0, stroke: "black", element: "ellipse", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }
            ])
            tempEleForSocket = { offsetX, offsetY, width: 0, height: 0, stroke: "black", element: "ellipse", strokeWidth: strokeWidth, canvasWidth: canvasWidth, eleID: currentId }

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
                    stroke: "black",
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
                stroke: "black",
                element: "fourSidesStar",
                strokeWidth: strokeWidth,
                canvasWidth: canvasWidth,
                eleID: currentId
            }
        }

        newElementsToOther(tempEleForSocket, setElements)
    }

    const [isShiftPressed, setIsShift] = useState(false)
    const mouseMove = (e) => {
        eraserCursor(e)
        e = e.nativeEvent
        if (!isDrawing) {
            return;
        }
        let tempEleForUpdateSocket = {}
        if (strokeType === "line") {
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
        }


        updateElementsToOther(tempEleForUpdateSocket, currentEleId, setElements, tempEleForUpdateSocket.element)

    }




    useEffect(() => {
        socket.on("updateElementToSocketUsers", (updatedElement, currentId, elementType) => {
            // console.log("updateElementToSocketUsers 29    " + elementType + "   " + currentId)
            if (elementType === "line") {
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

    useEffect(() => {
        fourStar2Function(500, 100, 500, 500)
    }, [])

    const fourStar2Function = (x1, y1, x2, y2) => {
        //1
        let height = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
        let base = height / 2 * (1 + Math.tan(Math.PI / 6))
        let perpen = base * Math.tan(Math.PI / 6)
        console.log(height + "  " + base + "   " + (2 * perpen + 2 * base))
        let line1_X1 = x1
        let line1_Y1 = y1
        let line1_X2 = x2
        let line1_Y2 = y2
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
    return (
        <div className='whiteboard-home'>
            <div style={{ display: "none" }} id="circularcursor"></div>

            <canvas ref={canvasRef} id="myCanvas"
                onMouseDown={mouseDown}
                onMouseMove={mouseMove}
                onMouseUp={mouseUp}
            >
            </canvas>
            {/* fourSidesStar */}

            <div className='toolbox'>
                <ul>
                    <li data-text="Line" ><Create onClick={() => { setStrokeType("line") }} /></li>
                    <li data-text="Rectangle"><CropSquare onClick={() => { setStrokeType("rect") }} /></li>
                    <li data-text="Circle"><PanoramaFishEye onClick={() => { setStrokeType("circle") }} /></li>
                    <li data-text="Ellipse"><PanoramaFishEye onClick={() => { setStrokeType("ellipse") }} /></li>
                    <li data-text="Pencil"><ModeEditOutline onClick={() => { setStrokeType("pencil") }} /></li>
                    <li data-text="Eraser"><AutoFixNormal onClick={() => { setStrokeType("eraser") }} /></li>
                    <li data-text="Four Sides Star"><StarBorderPurple500 onClick={() => { setStrokeType("fourSidesStar") }} /></li>
                    <li data-text="Clear WhiteBoard"><Clear onClick={clearWhiteBoard} /></li>
                    <li data-text="Undo"><Undo onClick={undoWhiteBoard} /></li>
                    <li data-text="Redo"><Redo onClick={redoWhiteBoard} /></li>
                    <li data-text="Stoke =  5px"><Clear onClick={() => { setStrokeWidth("5") }} /></li>
                    <li data-text="Stoke =  10px"><Clear onClick={() => { setStrokeWidth("10") }} /></li>
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

export default Whiteboard
