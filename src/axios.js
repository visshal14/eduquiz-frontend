import axios from "axios";
import { backendUrl } from "./frontendUrl"

const instance = axios.create({

    // baseURL: "http://localhost:4000"
    baseURL: backendUrl
})
export default instance;


// "dev": "react-scripts start",
// "start": "serve -s build",
// "build": "react-scripts build",
// "heroku-postbuild": "npm run build"



// "start": "react-scripts start",
// "build": "react-scripts build",
// "test": "react-scripts test",
// "eject": "react-scripts eject"