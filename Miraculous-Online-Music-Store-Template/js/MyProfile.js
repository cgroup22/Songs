$(document).ready(function() {
    $("#UpdateUserForm").submit(UpdateUser);
    // לא מאפשרים לשמוע שירים בדף עדכון המידע על מנת שאנשים לא ישארו בו
    // כי זו סכנת אבטחה (לדוגמה אם הולכים מהמחשב וישאירו דף זה פתוח...)
    HideAudioPlayer();
})
function LoginHeader() {
    if (!IsLoggedIn()) {
        alert("Please login first!");
        location.href = "index.html";
    } else {
        document.body.style.visibility = "visible";
        let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
        document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
        `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
        document.getElementById('NeedsMSProfile').classList.add('ms_profile');
        document.getElementById('EmailPH').value = data.email;
        document.getElementById('NamePH').value = data.name;
        document.getElementById('PasswordPH').value = data.password;
        document.getElementById('ConfirmPasswordPH').value = data.password;
        GetIsUserVerified();
    }
}
function UpdateUser() {
    if (!IsLoggedIn()) {
        alert("Please login first!");
        location.href = "index.html";
        return false;
    }
    if (document.getElementById('PasswordPH').value != document.getElementById('ConfirmPasswordPH').value) {
        UpdateError("Password don't match!", "red");
        return false;
    }
    data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    let oldEmail = data.email;
    const api = `${apiStart}/Users/UpdateUserDetails?oldEmail=${oldEmail}`;
    data.email = document.getElementById('EmailPH').value;
    data.name = document.getElementById('NamePH').value;
    data.password = document.getElementById('PasswordPH').value;
    // console.log(data);
    ajaxCall("PUT", api, JSON.stringify(data), UpdateSuccessCallback, UpdateErrorCallback);
    //UpdateError("", "red");
    return false;
}
function UpdateSuccessCallback(msg) {
    if (localStorage['User'] != undefined && localStorage['User'] != "")
        localStorage['User'] = JSON.stringify(data);
    if (sessionStorage['User'] != undefined && sessionStorage['User'] != "")
        sessionStorage['User'] = JSON.stringify(data);
    // console.log(msg.message)
    UpdateError(msg.message, 'white');
    // console.log(data);
}
function UpdateErrorCallback(msg) {
    console.log(msg);
    UpdateError(msg.responseJSON.message, "red");
}
function UpdateError(msg, color) {
    let x = document.getElementById('LoginErrorMSG');
    x.innerHTML = msg;
    x.style.color = color;
}
function GetIsUserVerified() {
    if (!IsLoggedIn()) return;
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    let id = data.id;
    const api = `${apiStart}/Users/IsUserVerified/id/${id}`;
    ajaxCall("GET", api, "", IsUserVerifiedSuccessCallback, GeneralErrorCallback);
}
function IsUserVerifiedSuccessCallback(bIsVerified) {
    // console.log(bIsVerified);
    if (!bIsVerified) {
        document.getElementById('verifyAccount').style.display = "inline-block";
        UpdateError("We recommend verifing your email!", "white");
    }
}
function VerifyRequest() {
    if (!IsLoggedIn()) return;
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    const api = `${apiStart}/Users/InitiateNewValidation?id=${data.id}`;
    console.log(api);
    ajaxCall("PUT", api, "", VerificationSentSCB, GeneralErrorCallback);
}
function VerificationSentSCB(msg) {
    UpdateError(msg.message, "green");
}