function LoadUserInformation(){

    const api = `${apiStart}/Users/LoadUserInformation`
    ajaxCall("GET", api, "", LoadUserSCB, ECB);
    
}

function LoadUserSCB(data){

    let Users = data;
    let str = `"<ul class="album_list_name">
    <li>Name</li>
    <li>Email</li>
    <li>Registration Date</li>
    <li class="text-center">Favorites</li></ul>"`;

    for(i in Users){

        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${Users[i].name}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)" class="sNames">${Users[i].email}</a></li>
        <li><a href="javascript:void(0)">${Users[i].registrationDate}</a></li>` +
        `<li class="text-center"><a href="javascript:void(0)">Nati Sharmota</a></li> 
    </ul>`;
    }

    document.getElementById("UsersContainer").innerHTML = str;
}