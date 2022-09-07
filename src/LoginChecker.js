


export const LoginChecker = (navigate) => {

    if (!window.localStorage.getItem("accessToken")) {
        // navigate("/login")
        window.location.href = `/login/${navigate}`
    }

}