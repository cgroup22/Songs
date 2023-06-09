function VerifyEmail() {
    // Get the email and token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');
    if (email == undefined || email == "" || token == undefined || token == "" || !email.includes('@') || !email.includes('.')) {
        alert("ERROR - Please try again later!");
        return;
    }
    const api = `${apiStart}/Users/ValidateEmail?email=${email}&token=${token}`;
    ajaxCall("PUT", api, "", scb, ecb);
}
function scb(d) {
    //alert(d)
    console.log(d)
    document.getElementById('Verify').innerHTML = d.message;
}
function ecb(d) {
    // alert(d.responseJSON.message)
    document.getElementById('Verify').innerHTML = d.responseJSON.message;
    console.log(d)
}