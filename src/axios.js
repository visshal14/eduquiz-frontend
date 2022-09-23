import axios from "axios";

const instance = axios.create({
    baseURL: "https://eduquiz001.herokuapp.com"
})
export default instance;