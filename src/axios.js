import axios from "axios";

const instance = axios.create({

    // baseURL: "http://localhost:3001"
    baseURL: "https://eduquiz001.herokuapp.com"
})
export default instance;

 // baseURL: "https://eduquiz001.herokuapp.com"

// "dev": "react-scripts start",
    // "start": "serve -s build",
    // "build": "react-scripts build",
    // "heroku-postbuild": "npm run build"



    // "start": "react-scripts start",
    // "build": "react-scripts build",
    // "test": "react-scripts test",
    // "eject": "react-scripts eject"