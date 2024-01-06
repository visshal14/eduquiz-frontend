
import { useState, useEffect } from 'react'



function Button({ name, font, link, padding, id, value, bgcolor }) {
    name = name || "Hello"
    font = font || "25"
    id = id || null
    value = value || null

    bgcolor = bgcolor || "white"
    const [width, setWidth] = useState((window.innerWidth / 4) - 40);


    useEffect(() => {
        if (padding > "10") {
            setWidth("auto")
        }
        // eslint-disable-next-line 
    }, [])
    window.addEventListener("resize", function (event) {
        if (padding === "10") {
            setWidth((window.innerWidth / 4) - 40);
        } else {
            setWidth("auto");
        }
    });
    padding = padding || "100"
    const mstyle = {
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: `${font}px`,
        padding: `15px ${padding}px`,
        borderRadius: "505px",
        border: (bgcolor !== "white") ? "transparent" : "1px solid black",
        backgroundColor: bgcolor,
        margin: "5px",
        width: width,
        whiteSpace: "nowrap",
        textAlign: "center",

    };

    return (
        <button value={value} id={id} onClick={() => { link?.toString().charAt(0) === "/" ? window.location.href = link : link() }} style={mstyle} > {name}</button >
    );
}


export default Button