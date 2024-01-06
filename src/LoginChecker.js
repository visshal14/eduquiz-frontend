

export const LoginChecker = (navigate) => {

    if (!window.localStorage.getItem("accessToken")) {
        // navigate("/login")
        window.location.href = `/student/login/${navigate}`
    }

}