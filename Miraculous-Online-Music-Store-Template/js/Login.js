function Register() {
    let password = document.getElementById("RegisterPassword").value;
    let confirmPassword = document.getElementById("RegisterConfirmPassword").value;
    if (password != confirmPassword) {
        document.getElementById("RegisterErrorMSG").innerHTML = "Passwords aren't matching!";
        return false;
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
    // console.log(data)
    // alert(data.message);
    document.getElementById("RegisterErrorMSG").innerHTML = "";
}
function RegisterErrorCallback(error) {
    // TODO: change the alert
    console.log(error)
    // alert(error.responseJSON.message)
    document.getElementById("RegisterErrorMSG").innerHTML = error.responseJSON.message;
}
function Login() {
    let email = document.getElementById("LoginEmail").value;
    let password = document.getElementById("LoginPassword").value;
    if (email == "")
        document.getElementById("LoginErrorMSG").innerHTML = "Please enter your email";
    if (password.length < 3)
        document.getElementById("LoginErrorMSG").innerHTML = "Please enter your password";
    if (email === "admin@admin" && password === "admin") {
        location.href = 'managePortal.html';
        return false;
    }
    const api = `${apiStart}/Users/Login?email=${email}&password=${password}`;
    ajaxCall("POST", api, "", LoginSuccessCallback, LoginErrorCallback);
    return false;
}
function LoginSuccessCallback(data) {
    let KeepSignedIn = document.getElementById("KeepMeSignedInCheckBox").checked;
    if (KeepSignedIn)
        localStorage['User'] = JSON.stringify(data);
    else sessionStorage['User'] = JSON.stringify(data);
    /*document.getElementById("LoginErrorMSG").innerHTML = "";

    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="upload.html" class="ms_btn">upload</a>`
    + `<a href="javascript:;" class="ms_admin_name">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    `<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a href="#">Logout</a></li></ul>`;
    $('#myModal1').modal('hide');*/
    location.href = window.location.pathname.split('/').pop();
}
function LoginErrorCallback(error) {
    document.getElementById("LoginErrorMSG").innerHTML = error.responseJSON.message;
}
function RemoveErrorMesseages() {
    document.getElementById("RegisterErrorMSG").innerHTML = "";
    document.getElementById("LoginErrorMSG").innerHTML = "";
    document.getElementById("RegisterPassword").value = "";
    document.getElementById("RegisterConfirmPassword").value = "";
    document.getElementById("RegisterEmail").value = "";
    document.getElementById("RegisterName").value = "";
    document.getElementById("LoginEmail").value = "";
    document.getElementById("LoginPassword").value = "";
}