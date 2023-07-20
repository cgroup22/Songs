$(document).ready(function () {
    $("#UploadArtistForm").submit(InsertArtistToDB);
    $("#UploadSongForm").submit(InsertSongToDB);
});
function ManageLoaded() {
    HideAudioPlayer();
    DisplayOptions();
}
function GetGenresInfo() {
    const api = `${apiStart}/Genres/AdminGetGenresInformation`;
    ajaxCall("GET", api, "", GetGenresInfoSCB, ECB);
}
function GetSongsInfo() {
    const api = `${apiStart}/Songs/AdminGetSongsData`;
    ajaxCall("GET", api, "", GetSongsInfoSCB, ECB);
}
function GetSongsInfoSCB(data) {
    // console.log(data);
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <ul class="album_list_name">
                            <li style="width:7%;">Song ID</li>
							<li>Song Name</li>
							<li style="width:10%;">Release Year</li>
							<li>Plays</li>
							<li>Performer</li>
							<li>Genre</li>
							<li>Song Favorites</li>
						</ul>`;
    for (i of data) {
        str += `<ul>
        <li style="width:7%;"><a href="javascript:void(0)"><span class="play_no">${i.songID}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)">${i.songName}</a></li>
        <li style="width:10%;"><a href="javascript:void(0)">${i.releaseYear}</a></li>
        <li><a href="javascript:void(0)">${i.numOfPlays}</a></li>
        <li><a href="javascript:void(0)">${i.performerName}</a></li>
        <li><a href="javascript:void(0)">${i.genreName}</a></li>
        <li><a href="javascript:void(0)">${i.totalFavorites}</a></li>
    </ul>`;
    }
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("SongsData").style.display = 'block';
    document.getElementById("SongsData").innerHTML = str;
}
function GetPerformersInfo() {
    const api = `${apiStart}/Performers/AdminGetPerformersData`;
    ajaxCall("GET", api, "", GetPerformersInfoSCB, ECB);
}
function GetPerformersInfoSCB(data) {
    // console.log(data);
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a><ul class="album_list_name">
    <li>Performer ID</li>
    <li>Performer Name</li>
    <li>Is A Band</li>
    <li>Instagram Handle</li>
    <li>Total Plays</li>
    <li>Followers</li>
</ul>`;
    for (i of data) {
        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${i.performerID}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)">${i.performerName}</a></li>
        <li><a href="javascript:void(0)">${i.isABand}</a></li>
        <li><a href="javascript:void(0)">${i.performerInstagram}</a></li>
        <li><a href="javascript:void(0)">${i.totalPlays}</a></li>
        <li><a href="javascript:void(0)">${i.totalFollowers}</a></li>
    </ul>`;
    }
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("PerformersData").style.display = 'block';
    document.getElementById("PerformersData").innerHTML = str;
}
function GetGenresInfoSCB(data) {
    // console.log(data);
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a><ul class="album_list_name">
    <li>Genre ID</li>
    <li>Genre Name</li>
    <li>Number Of Songs</li>
    <li>Number Of Plays</li>
</ul>`;
    for (i of data) {
        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${i.genreID}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)">${i.genreName}</a></li>
        <li><a href="javascript:void(0)">${i.numOfSongs}</a></li>
        <li class="text-center"><a href="javascript:void(0)">${i.numOfPlays}</a></li>
    </ul>`;
    }
    document.getElementById("GenresContainer").style.display = 'block';
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("GenresContainer").innerHTML = str;
}
function LoadUserInformation() {
    const api = `${apiStart}/Users/LoadUserInformation`;
    ajaxCall("GET", api, "", LoadUserSCB, ECB);
}
function LoadUserSCB(data){
    document.getElementById("UsersContainer").style.display = 'block';
    document.getElementById("AdminOptions").style.display = 'none';
    let Users = data;
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a><ul class="album_list_name">
    <li>User ID</li>
    <li>Name</li>
    <li>Email</li>
    <li>Registration Date</li></ul>`;
    for(i in Users){
        str += `<ul>
        <li><a href="javascript:void(0)">${Users[i].id}</a></li>
        <li><a href="javascript:void(0)">${Users[i].name}</a></li>
        <li><a href="javascript:void(0)" class="sNames">${Users[i].email}</a></li>
        <li><a href="javascript:void(0)">${Users[i].registrationDate.split('T')[0]}</a></li></ul>`;
    }
    document.getElementById("UsersContainer").innerHTML = str;
}
function DisplayOptions() {
    document.getElementById("UsersContainer").style.display = 'none';
    document.getElementById("AdminOptions").style.display = 'block';
    document.getElementById("UploadArtistForm").style.display = 'none';
    document.getElementById("UploadSongForm").style.display = 'none';
    document.getElementById("GenresContainer").style.display = 'none';
    document.getElementById("PerformersData").style.display = 'none';
    document.getElementById("SongsData").style.display = 'none';
}
function UploadArtist() {
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("UploadArtistForm").style.display = 'block';
}
function UploadSong() {
    const api = `${apiStart}/Performers`;
    ajaxCall("GET", api, "", UploadSongSCB, UploadSongECB);
    const api2 = `${apiStart}/Genres`;
    ajaxCall("GET", api2, "", UpdateGenres, UploadSongECB);
}
function UploadSongECB() {
    DisplayOptions();
    openPopup('ERROR', 'red', 'Cannot upload song at this time. Try again later!');
}
function UpdateGenres(data) {
    let str = ``;
    for (i of data)
        str += `<option value="${i.genreName}" id="${i.genreID}">${i.genreName}</option>`;
    document.getElementById("GenreSelect").innerHTML = str;
}
function UploadSongSCB(data) {
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("UploadSongForm").style.display = 'block';
    let str = ``;
    for (i of data)
        str += `<option value="${i.performerName}" id="${i.performerID}">${i.performerName}</option>`;
    document.getElementById("PerformerSelect").innerHTML = str;
}
function InsertArtistToDB() {
    let PName = document.getElementById('PName').value;
    let PIsBand = document.getElementById('PIsBand').checked ? 1 : 0;
    let PImage = document.getElementById('PImage').value;
    let instagram;
    if (document.getElementById('PInstagram').value == undefined || document.getElementById('PInstagram').value == "")
    instagram = "null";
    else instagram = document.getElementById('PInstagram').value;
    let ArtistToInsert = {
        performerID: 0,
        performerName: PName,
        isABand: PIsBand,
        performerImage: PImage,
        Instagram: instagram
    };
    const api = `${apiStart}/Performers`;
    ajaxCall("POST", api, JSON.stringify(ArtistToInsert), InsertArtistToDBSCB, ECB);
    return false;
}
function InsertArtistToDBSCB(msg) {
    openPopup(msg.message, 'green', 'Artist insterted to the database!');
}
/*function InsertSongToDB() {
    let SName = document.getElementById('SName').value;
    let genreSelect = document.getElementById("GenreSelect");
    let GenreID = genreSelect.children[genreSelect.selectedIndex].id;
    let RYear = document.getElementById('SYear').value;
    let artistSelect = document.getElementById("PerformerSelect");
    let PerformerID = artistSelect.children[artistSelect.selectedIndex].id;
    let SLength = document.getElementById('SLength').value;
    let SLyrics = document.getElementById('SLyrics').value;
    let MP3File = document.getElementById('SFile').files[0];
    console.log(MP3File);
    let SongToInsert = [{"file": MP3File, "song": {
        id: 0,
        name: SName,
        lyrics: SLyrics,
        numOfPlays: 0,
        genreID: GenreID,
        releaseYear: RYear,
        performerID: PerformerID,
        length: SLength
    }}];
    let x= {"key":"string","value":["string"]}
    const api = `${apiStart}/Songs`;
    ajaxCall("POST", api, JSON.stringify(x), InsertSongToDBSCB, ECB);
    return false;
}*/
function InsertSongToDB() {
    let SName = document.getElementById('SName').value;
    let genreSelect = document.getElementById("GenreSelect");
    let GenreID = genreSelect.children[genreSelect.selectedIndex].id;
    let RYear = document.getElementById('SYear').value;
    let artistSelect = document.getElementById("PerformerSelect");
    let PerformerID = artistSelect.children[artistSelect.selectedIndex].id;
    let SLength = document.getElementById('SLength').value;
    let SLyrics = document.getElementById('SLyrics').value;
    let MP3File = document.getElementById('SFile').files[0];

    let SongWithoutFile = {
        id: 0,
        name: SName,
        lyrics: SLyrics,
        numOfPlays: 0,
        genreID: GenreID,
        releaseYear: RYear,
        performerID: PerformerID,
        length: SLength
    };

    // Create a FormData object
    formData = new FormData();
    formData.append('SFile', MP3File);
    /*formData.append('SName', SName);
    formData.append('GenreID', GenreID);
    formData.append('SYear', RYear);
    formData.append('PerformerID', PerformerID);
    formData.append('SLength', SLength);
    formData.append('SLyrics', SLyrics);*/
    const api = `${apiStart}/Songs/PostSongDataWithoutFile`
    ajaxCall("POST", api, JSON.stringify(SongWithoutFile), InsertActualFile, ECB);
    // Send the formData object to the server
    // console.log(formData.get('SFile'))
    
    //ajaxCall2("POST", api, JSON.stringify(formData), InsertSongToDBSCB, ECB);
    return false;
}

function InsertActualFile(data) {
    // console.log(data);
    const api = `${apiStart}/Songs/PostFileDataFromJS/SongID/${data.songID}`;
    $.ajax({
        type: "POST",
        url: api,
        data: formData,
        cache: false,
        contentType: false,
        processData: false, // Ensure FormData is not processed by jQuery
        success: InsertSongToDBSCB,
        error: ECB
      });
}
function InsertSongToDBSCB(msg) {
    // console.log(msg);
    openPopup("Added!", 'green', "The new song has been successfuly added to the database!");
}