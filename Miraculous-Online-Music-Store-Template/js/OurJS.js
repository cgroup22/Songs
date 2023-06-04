const port = "44355";
const apiStart = `https://localhost:${port}/api`;
$(document).ready(function () {
    $("#RegisterForm").submit(Register);
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
    ajaxCall("POST", api, JSON.stringify(User), RegisterSuccessCallback, RegisterErrorCallback);
    return false;
}
function RegisterSuccessCallback(data) {
    // TODO: change the alert
    console.log(data)
    alert(data.message);
}
function RegisterErrorCallback(error) {
    // TODO: change the alert
    console.log(error)
    alert(error.responseJSON.message)
}