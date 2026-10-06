const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname)

// frontend url follows whichever domain the app is served from
// (localhost, eduquiz01.netlify.app, eduquiz.visshal14.com)
const url = window.location.origin

//for localhost
const localConfig = {
    backendUrl: "http://localhost:4000",
    peerPort: "4000",
    peerSecure: true,
}

//for server
const serverConfig = {
    backendUrl: "https://eduquiz001.onrender.com",
    peerPort: "443",
    peerSecure: true,
}

const { backendUrl, peerPort, peerSecure } = isLocalhost ? localConfig : serverConfig

export default url
export { backendUrl, peerPort, peerSecure }
