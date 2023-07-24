//const port = "44355"; // port of the server.
//const apiStart = `https://localhost:${port}/api`; // host url.
const apiStart = `https://proj.ruppin.ac.il/cgroup22/test2/tar1/api`;
function VerifyEmail() {
    // Get the email and token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');
    if (email == undefined || email == "" || token == undefined || token == "" || !email.includes('@') || !email.includes('.')) {
        document.getElementById('Verify').innerHTML = "ERROR - Please try again later!";
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
    document.getElementById('Verify').innerHTML = "ERROR: " + d.responseJSON.message;
    console.log(d)
}