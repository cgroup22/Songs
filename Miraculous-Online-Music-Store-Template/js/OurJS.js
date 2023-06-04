const port = "44355";
const apiStart = `https://localhost:${port}/api`;
$(document).ready(function () {
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
});
function Register() {
    let password = document.getElementById("RegisterPassword").value;
    let confirmPassword = document.getElementById("RegisterConfirmPassword").value;
    if (password != confirmPassword) {
        alert("Passwords aren't matching!");
        return;
    }
    let email = document.getElementById("RegisterEmail").value;
    let name = document.getElementById("RegisterName").value;
    const api = `${apiStart}/Users`;
    let User = {
        email: email,
        name: name,
        password: password
    };
    ajaxCall("POST", api, JSON.stringify(User), RegisterSuccessCallback, ErrorCallback);
    return false;
}
function RegisterSuccessCallback(data) {
    // TODO: change the alert
    console.log(data)
    alert(data.message);
}
function ErrorCallback(error) {
    // TODO: change the alert
    console.log(error)
    alert(error.responseJSON.message)
}
function Login() {
    let email = document.getElementById("LoginEmail").value;
    let password = document.getElementById("LoginPassword").value;
    if (email == "")
        alert("Please enter your email");
    if (password.length < 3)
        alert("Please enter your password");
    const api = `${apiStart}/Users/Login?email=${email}&password=${password}`;
    ajaxCall("POST", api, "", LoginSuccessCallback, ErrorCallback);
    return false;
}
function LoginSuccessCallback(data) {
    console.log(data)
}