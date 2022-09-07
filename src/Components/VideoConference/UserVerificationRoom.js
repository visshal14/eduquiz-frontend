import axios from "../../axios"

export const UserVerificationRoom = (id, status) => {
    let testUrl = "/conference/" + id + "/hello"
    if (status === "p") return window.history.replaceState(`"/conference/"${id}/`, null, testUrl);
    axios.get(`/roomIsUserVerified/${id}`, { headers: { "Authorization": `Bearer ${window.localStorage.getItem("accessToken")}` } })
        .then(function (response) {
            if (response.data.errMsg) {
                window.location.href = `/room-selection/${id}/hello`
            }

        });
}