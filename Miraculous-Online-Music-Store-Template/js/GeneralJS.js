const port = "44355";
const apiStart = `https://localhost:${port}/api`;
// Returns true if the user is logged in, false otherwise.
function IsLoggedIn() {
    return sessionStorage['User'] != undefined && sessionStorage['User'] != "" || localStorage['User'] != undefined && localStorage['User'] != "";
}
// Removes the account from the browser storage
function Logout() {
    // TODO
    localStorage['User'] = "";
    sessionStorage['User'] = "";
    location.href = window.location.pathname.split('/').pop();
}
// מקבלת שם, ומחזירה את האותיות הראשונות לפי השם הפרטי ושם המשפחה
// מקסימום - 3 אותיות, זה משומש בתמונה של המשתמש אחרי ההתחברות
function GetFirstLettersOfName(name) {
    let s = name.split(' ');
    let res = '';
    for (i in s) {
        if (i > 2)
            break;
        res += s[i][0];
    }
    return res;
}
function ToggleProfile() {
    $(".pro_dropdown_menu").toggleClass("open_dropdown");
}
function GeneralErrorCallback(e) {
    console.log(e);
    alert(e.responseJSON.message);
}