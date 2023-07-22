$(document).ready(function() {
    $("#UpdateUserForm").submit(UpdateUser); // updates user info
    // לא מאפשרים לשמוע שירים בדף עדכון המידע על מנת שאנשים לא ישארו בו
    // כי זו סכנת אבטחה (לדוגמה אם הולכים מהמחשב וישאירו דף זה פתוח...)
    HideAudioPlayer();
})
// updates user details
function LoginHeader() {
    document.body.style.visibility = "visible";
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "Please login first!");
        setTimeout(() => {location.href = "index.html";}, 1500);
    } else {
        let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
        document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
        `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
        document.getElementById('NeedsMSProfile').classList.add('ms_profile');
        document.getElementById('EmailPH').value = data.email;
        document.getElementById('NamePH').value = data.name;
        document.getElementById('PasswordPH').value = data.password;
        document.getElementById('ConfirmPasswordPH').value = data.password;
        GetIsUserVerified();
        GetUserRegistrationDate();
        GetUserXP();
    }
}
// gets user registration date
function GetUserRegistrationDate() {
    if (!IsLoggedIn()) return;
    let UserID = GetUserID();
    if (UserID < 1) return;
    const api = `${apiStart}/Users/GetUserRegistrationDate/UserID/${UserID}`;
    ajaxCall("GET", api, "", GetUserRegistrationDateSCB, (e) => {console.log(e);});
}
// gets user xp
function GetUserXP() {
    if (!IsLoggedIn()) return;
    let UserID = GetUserID();
    if (UserID < 1) return;
    const api = `${apiStart}/Users/GetUserXP/UserID/${UserID}`;
    ajaxCall("GET", api, "", GetUserXPSCB, (e) => {console.log(e);});
}
// updates user level dynamically
function GetUserXPSCB(data) {
    let XP = data.userXP;
    let level = Math.floor(XP / 100) + 1;
    document.getElementById('UserLevel').innerHTML = `Level: <span style="color:red;">${level}</span> - You need <span style="color:red;">${100 - (XP % 100)} XP</span> to reach level ${level + 1}`;
    document.getElementById('UserLevel').style.display = `block`;
    // console.log(level)
}
// updates user registration date
function GetUserRegistrationDateSCB(data) {
    document.getElementById('registrationDate').style.display = 'block';
    document.getElementById('registrationDate').innerHTML = "Registration Date: " + data.registrationDate.split(' ')[0];
}
// update user info on submit
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
// on sucess, save new user object to storage
function UpdateSuccessCallback(msg) {
    if (localStorage['User'] != undefined && localStorage['User'] != "")
        localStorage['User'] = JSON.stringify(data);
    if (sessionStorage['User'] != undefined && sessionStorage['User'] != "")
        sessionStorage['User'] = JSON.stringify(data);
    // console.log(msg.message)
    UpdateError(msg.message, 'white'); // used update error to save a new function and element.
    // console.log(data);
}
// updates error
function UpdateErrorCallback(msg) {
    console.log(msg);
    UpdateError(msg.responseJSON.message, "red");
}
// updates message for the user to see
function UpdateError(msg, color) {
    let x = document.getElementById('LoginErrorMSG');
    x.innerHTML = msg;
    x.style.color = color;
}
// gets if user is verified
function GetIsUserVerified() {
    if (!IsLoggedIn()) return;
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    let id = data.id;
    const api = `${apiStart}/Users/IsUserVerified/id/${id}`;
    ajaxCall("GET", api, "", IsUserVerifiedSuccessCallback, GeneralErrorCallback);
}
// if not verified, shows message and button to verify
function IsUserVerifiedSuccessCallback(bIsVerified) {
    // console.log(bIsVerified);
    if (!bIsVerified) {
        document.getElementById('verifyAccount').style.display = "inline-block";
        UpdateError("We recommend verifing your email!", "white");
    }
}
// initiate new verification request
function VerifyRequest() {
    if (!IsLoggedIn()) return;
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    const api = `${apiStart}/Users/InitiateNewValidation?id=${data.id}`;
    console.log(api);
    ajaxCall("PUT", api, "", VerificationSentSCB, GeneralErrorCallback);
}
// show message verification sent.
function VerificationSentSCB(msg) {
    UpdateError(msg.message, "green");
}