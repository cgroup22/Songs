$(document).ready(function () {
    $("#UploadArtistForm").submit(InsertArtistToDB);
    $("#UploadSongForm").submit(InsertSongToDB);
    initFirebase(); // init fb, used for the admin's report
});
// Onload, hide audio player and display admin's options
function ManageLoaded() {
    HideAudioPlayer();
    DisplayOptions();
}
// Gets all messages the users have submitted.
function GetMessages() {
    const api = `${apiStart}/Messages`;
    ajaxCall("GET", api, "", GetMessagesSCB, ECB);
}
// On success, build the html page dynamically.
function GetMessagesSCB(data) {
    MessageReport = {
        "MessageID": [],
        "UserID": [],
        "Subject": [],
        "Content": [],
        "UserEmail": [],
        "Date": [],
        "UserName": []
    };
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadMessagesReport()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a>
    <ul class="album_list_name">
    <li style="width:7%;">Message ID</li>
    <li style="width:7%;">User ID</li>
    <li>User Name</li>
    <li>User Email</li>
    <li>Subject</li>
    <li>Content</li>
    <li>Date</li>
    </ul>`;
    for (i of data) {
        i.date = i.date.split('T')[0];
        MessageReport.MessageID.push(i.messageID);
        MessageReport.UserID.push(i.userID);
        MessageReport.Subject.push(i.subject);
        MessageReport.Content.push(i.content);
        MessageReport.UserEmail.push(i.userEmail);
        MessageReport.Date.push(i.date);
        MessageReport.UserName.push(i.userName);
        str += `<ul>
        <li style="width:7%;"><a href="javascript:void(0)">${i.messageID}</a></li>
        <li style="width:7%;"><a href="javascript:void(0)">${i.userID}</a></li>
        <li><a href="javascript:void(0)">${i.userName}</a></li>
        <li><a href="javascript:void(0)">${i.userEmail}</a></li>
        <li><a href="javascript:void(0)">${i.subject}</a></li>
        <li><a href="javascript:void(0)">${i.content}</a></li>
        <li><a href="javascript:void(0)">${i.date}</a></li>
    </ul>`;
    }
    document.getElementById('MessagesData').innerHTML = str;
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("MessagesData").style.display = 'block';
}
// Downloads messages as csv file.
function DownloadMessagesReport() {
    if ("undefined" == typeof MessageReport) return;
    const csvData = convertObjectToCSV(MessageReport);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "MessagesReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
}
// get genres
function GetGenresInfo() {
    const api = `${apiStart}/Genres/AdminGetGenresInformation`;
    ajaxCall("GET", api, "", GetGenresInfoSCB, ECB);
}
// get songs
function GetSongsInfo() {
    const api = `${apiStart}/Songs/AdminGetSongsData`;
    ajaxCall("GET", api, "", GetSongsInfoSCB, ECB);
}
// generates admin report
function GenerateReport() {
    const api = `${apiStart}/Users/GetAdminReport`;
    ajaxCall("GET", api, "", GenerateReportSCB, ECB);
}
// on sucess, updates report dynamically.
function GenerateReportSCB(data) {
    Report = data;
    // console.log(data);
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>`;
    str += `<p class="Report">Most played performer: ${Report.mostPlayedPerformer} with: ${Report.numOfPlaysMostPlayedPerformer} Plays</p>
    <p class="Report">Most followed performer: ${Report.mostFollowedPerformer} with: ${Report.numOfFollowersMostFollowedPerformer} Plays</p>
    <p class="Report">Most played genre: ${Report.mostPlayedGenre} with: ${Report.mostPlayedGenrePlays} Plays</p>
    <p class="Report">We currently have: ${Report.numberOfUsers} registered users.</p>
    <p class="Report">Solo quizzes played: ${Report.soloQuizzesPlayed}</p>`
    if (typeof MPQuizzes != "undefined")
    str += `<p class="Report">Multiplayer quizzes played: ${MPQuizzes}</p>`;
    str += `<div class="ms_btn manageBTNS" onclick="DownloadReport()" style="margin-bottom:10px;"><a href="javascript:void(0)" style="color:white;">Download</a></div>`;
    document.getElementById('ReportData').innerHTML = str;
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("ReportData").style.display = 'block';
}
// Download admin report
function DownloadReport() {
    // console.log(Report)
    if ("undefined" == typeof Report) return;
    if (typeof MPQuizzes != "undefined")
        Report.multiplayerQuizzesPlayed = MPQuizzes;
    const csvData = convertObjectToCSV(Report);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "GeneralReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
}
// convert object to csv format
function convertObjectToCSV(obj) {
    const csvRows = [];
    for (const key in obj) {
      if (Object.hasOwnProperty.call(obj, key)) {
        const csvRow = `${key},${obj[key]}`;
        csvRows.push(csvRow);
      }
    }
    return csvRows.join("\n");
  }
  function DownloadSongsReport() {
    if ("undefined" == typeof Songs) return;
    const csvData = convertObjectToCSV(Songs);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "SongsReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  }
  function DownloadPerformersReport() {
    if (typeof PerformersData == 'undefined') return;
    const csvData = convertObjectToCSV(PerformersData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "PerformersReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  }
  function DownloadGenresReport() {
    if (typeof GenresData == 'undefined') return;
    const csvData = convertObjectToCSV(GenresData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "GenresReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
  }
// get songs, and updates html dynamically
function GetSongsInfoSCB(data) {
    // console.log(data);
    Songs = {
        'songID': [],
        "songName": [],
        'artist': [],
        'duration': [],
        'genreName': [],
        'numOfPlays': [],
        'releaseYear': [],
        'totalFavorites': []
    };
    for (i of data) {
        Songs.songID.push(i.songID);
        Songs.songName.push(i.songName);
        Songs.artist.push(i.performerName);
        Songs.duration.push(i.songLength);
        Songs.genreName.push(i.genreName);
        Songs.numOfPlays.push(i.numOfPlays);
        Songs.releaseYear.push(i.releaseYear);
        Songs.totalFavorites.push(i.totalFavorites);
    }
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadSongsReport()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a>
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
        <li style="width:7%;"><a href="javascript:void(0)"><span class="play_no">${i.songID}</span></a></li>
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
// get artists
function GetPerformersInfo() {
    const api = `${apiStart}/Performers/AdminGetPerformersData`;
    ajaxCall("GET", api, "", GetPerformersInfoSCB, ECB);
}
// updates html dynamically on sucess when getting artists
function GetPerformersInfoSCB(data) {
    // console.log(data);
    PerformersData = {
        'PerformerID': [],
        'PerformerName': [],
        'isABand': [],
        'totalFollowers': [],
        'totalPlays': [],
        'PerformerInstagram': [],
        'NumOfUserFavorites': []
    };
    for (i of data) {
        PerformersData.PerformerID.push(i.performerID);
        PerformersData.PerformerName.push(i.performerName);
        PerformersData.isABand.push(i.isABand);
        PerformersData.totalFollowers.push(i.totalFollowers);
        PerformersData.totalPlays.push(i.totalPlays);
        PerformersData.PerformerInstagram.push(i.performerInstagram);
        PerformersData.NumOfUserFavorites.push(i.numOfUserFavorites);
    }
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadPerformersReport()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a><br>
    <ul class="album_list_name">
    <li style="width:10%;">Performer ID</li>
    <li>Performer Name</li>
    <li style="width:10%;">Is A Band</li>
    <li>Instagram Handle</li>
    <li style="width:10%;">Total Plays</li>
    <li style="width:8%;">Followers</li>
    <li>User Favorites</li>
</ul>`;
    for (i of data) {
        str += `<ul>
        <li style="width:10%;"><a href="javascript:void(0)"><span class="play_no">${i.performerID}</span></a></li>
        <li><a href="javascript:void(0)">${i.performerName}</a></li>
        <li style="width:10%;"><a href="javascript:void(0)">${i.isABand}</a></li>
        <li><a href="javascript:void(0)">${i.performerInstagram}</a></li>
        <li style="width:10%;"><a href="javascript:void(0)">${i.totalPlays}</a></li>
        <li style="width:8%;"><a href="javascript:void(0)">${i.totalFollowers}</a></li>
        <li><a href="javascript:void(0)">${i.numOfUserFavorites}</a></li>
    </ul>`;
    }
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("PerformersData").style.display = 'block';
    document.getElementById("PerformersData").innerHTML = str;
}
// updates gernes dynamically
function GetGenresInfoSCB(data) {
    GenresData = {
        'GenreID': [],
        'GenreName': [],
        'numOfPlays': [],
        'numOfSongs': []
    };
    for (i of data) {
        GenresData.GenreID.push(i.genreID);
        GenresData.GenreName.push(i.genreName);
        GenresData.numOfPlays.push(i.numOfPlays);
        GenresData.numOfSongs.push(i.numOfSongs);
    }
    // console.log(data);
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadGenresReport()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a><br>
    <ul class="album_list_name">
    <li>Genre ID</li>
    <li>Genre Name</li>
    <li>Number Of Songs</li>
    <li>Number Of Plays</li>
</ul>`;
    for (i of data) {
        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${i.genreID}</span></a></li>
        <li><a href="javascript:void(0)">${i.genreName}</a></li>
        <li><a href="javascript:void(0)">${i.numOfSongs}</a></li>
        <li><a href="javascript:void(0)">${i.numOfPlays}</a></li>
    </ul>`;
    }
    document.getElementById("GenresContainer").style.display = 'block';
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("GenresContainer").innerHTML = str;
}
// gets users information
function LoadUserInformation() {
    const api = `${apiStart}/Users/LoadUserInformation`;
    ajaxCall("GET", api, "", LoadUserSCB, ECB);
}
// Downloads the user report to the admins local PC
function DownloadUsersReport() {
    if ("undefined" == typeof UsersData) return;
    const csvData = convertObjectToCSV(UsersData);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.setAttribute("href", url);
      downloadLink.setAttribute("download", "UsersReport.csv");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
}
// updates users dynamically
function LoadUserSCB(data) {
    // console.log(data)
    UsersData = {
        'UserID': [],
        'email': [],
        'isVerified': [],
        'registrationDate': [],
        'IsBanned': []
    };
    for (i of data) {
        UsersData.UserID.push(i.id);
        UsersData.email.push(i.email);
        UsersData.isVerified.push(i.isVerified);
        UsersData.registrationDate.push(i.registrationDate.split('T')[0]);
        UsersData.IsBanned.push(i.isBanned ? "Banned" : "Not Banned");
    }
    document.getElementById("UsersContainer").style.display = 'block';
    document.getElementById("AdminOptions").style.display = 'none';
    let Users = data;
    let str = `<a onclick="DisplayOptions()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadUsersReport()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a><br>
    <ul class="album_list_name">
    <li>User ID</li>
    <li>Name</li>
    <li>Email</li>
    <li>Registration Date</li>
    <li>User Favorites</li>
    <li>Ban</li></ul>`;
    for(i in Users){
        str += `<ul>
        <li><a href="javascript:void(0)">${Users[i].id}</a></li>
        <li><a href="javascript:void(0)">${Users[i].name}</a></li>
        <li><a href="javascript:void(0)" class="sNames">${Users[i].email}</a></li>
        <li><a href="javascript:void(0)">${Users[i].registrationDate.split('T')[0]}</a></li>
        <li onclick="WatchUserFav(${Users[i].id})"><a href="javascript:void(0)" class="sNames"><span class="ms_icon1 ms_active_icon"></span></a></li>`;
        if (Users[i].isBanned)
        str += `<li onclick="Unban(${Users[i].id})" id="${Users[i].id}"><a href="javascript:void(0)">Unban</a></li>`;
        else str += `<li onclick="Ban(${Users[i].id})" id="${Users[i].id}"><a href="javascript:void(0)">Ban</a></li>`;
        str += `</ul>`;
    }
    document.getElementById("UsersContainer").innerHTML = str;
}
// Used to unban a user
function Unban(uid) {
    tmpUnbanElem = document.getElementById(uid);
    tmpUID = uid;
    const api = `${apiStart}/Users/UnbanUser?UserID=${uid}`;
    ajaxCall("PUT", api, "", UnbanSCB, ECB);
}
// On sucess, update html.
function UnbanSCB() {
    tmpUnbanElem.querySelector('a').innerHTML = 'Ban';
    tmpUnbanElem.setAttribute('onclick', `Ban(${tmpUID})`);
}
// Used to ban a user
function Ban(uid) {
    tmpBanElem = document.getElementById(uid);
    tmpUID = uid;
    const api = `${apiStart}/Users/BanUser?UserID=${uid}`;
    ajaxCall("PUT", api, "", BanSCB, ECB);
}
// On sucess, update html.
function BanSCB() {
    tmpBanElem.querySelector('a').innerHTML = 'Unban';
    tmpBanElem.setAttribute('onclick', `Unban(${tmpUID})`);
}
// Used to show the admin the user's favorites.
function WatchUserFav(uid) {
    const api = `${apiStart}/Users/GetUserFavorites/UserID/${uid}`;
    ajaxCall("GET", api, "", WatchUserFavSCB, ECB);
}
function WatchUserFavSCB(data) {
    // console.log(data);
    UserFav = data;
    UserFavReport = {
        'SongID': [],
        'SongName': [],
        'Length': [],
        'PerformerID': [],
        'PerformerName': [],
    };
    let str = `<a onclick="LoadUserInformation()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Back</a>
    <a onclick="DownloadUsersFav()" href="javascript:void(0)" class="ms_btn manageBTNS" style="color:white; margin-bottom:10px;">Download</a><br>
    <ul class="album_list_name">
    <li>Song ID</li>
    <li>Song Name</li>
    <li>Duration</li>
    <li>Performer ID</li>
    <li>Performer Name</li>
    </ul>`;
    for (i in data) {
        str += `<ul>
        <li><a href="javascript:void(0)">${UserFav[i].songID}</a></li>
        <li><a href="javascript:void(0)">${UserFav[i].songName}</a></li>
        <li><a href="javascript:void(0)">${UserFav[i].length}</a></li>
        <li><a href="javascript:void(0)">${UserFav[i].performerID}</a></li>
        <li><a href="javascript:void(0)">${UserFav[i].performerName}</a></li>
        </ul>`;
        UserFavReport.SongID.push(UserFav[i].songID);
        UserFavReport.SongName.push(UserFav[i].songName);
        UserFavReport.Length.push(UserFav[i].length);
        UserFavReport.PerformerID.push(UserFav[i].performerID);
        UserFavReport.PerformerName.push(UserFav[i].performerName);
    }
    if (data.length == 0)
        str += `<p style="color:white;font-size:20px;text-align:center;margin-top:20px;">None</p>`
    document.getElementById('UsersContainer').innerHTML = str;
}
function DownloadUsersFav() {
    if ("undefined" == typeof UserFavReport) return;
    const csvData = convertObjectToCSV(UserFavReport);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", "UsersFavoritesReport.csv");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
// display admin's options
function DisplayOptions() {
    document.getElementById("UsersContainer").style.display = 'none';
    document.getElementById("AdminOptions").style.display = 'block';
    document.getElementById("UploadArtistForm").style.display = 'none';
    document.getElementById("UploadSongForm").style.display = 'none';
    document.getElementById("GenresContainer").style.display = 'none';
    document.getElementById("PerformersData").style.display = 'none';
    document.getElementById("SongsData").style.display = 'none';
    document.getElementById("ReportData").style.display = 'none';
    document.getElementById("MessagesData").style.display = 'none';
}
// uploads artist form
function UploadArtist() {
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("UploadArtistForm").style.display = 'block';
}
// uploads song with file to db
function UploadSong() {
    const api = `${apiStart}/Performers`;
    ajaxCall("GET", api, "", UploadSongSCB, UploadSongECB);
    const api2 = `${apiStart}/Genres`;
    ajaxCall("GET", api2, "", UpdateGenres, UploadSongECB);
}
// upload song error, popups error
function UploadSongECB() {
    DisplayOptions();
    openPopup('ERROR', 'red', 'Cannot upload song at this time. Try again later!');
}
// update genres on screen
function UpdateGenres(data) {
    let str = ``;
    for (i of data)
        str += `<option value="${i.genreName}" id="${i.genreID}">${i.genreName}</option>`;
    document.getElementById("GenreSelect").innerHTML = str;
}
// upload song scb, updates html dynamically
function UploadSongSCB(data) {
    document.getElementById("AdminOptions").style.display = 'none';
    document.getElementById("UploadSongForm").style.display = 'block';
    let str = ``;
    for (i of data)
        str += `<option value="${i.performerName}" id="${i.performerID}">${i.performerName}</option>`;
    document.getElementById("PerformerSelect").innerHTML = str;
}
// inserts artist to db (only admin can insert artists and songs)
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
// on sucess, popup message
function InsertArtistToDBSCB(msg) {
    openPopup(msg.message, 'green', 'Artist insterted to the database!');
}
// inserts song to db
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
    const api = `${apiStart}/Songs/PostSongDataWithoutFile`
    ajaxCall("POST", api, JSON.stringify(SongWithoutFile), InsertActualFile, ECB);
    return false;
}
// insert song file to db
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
// insert song file sucess, popup message
function InsertSongToDBSCB(msg) {
    // console.log(msg);
    openPopup("Added!", 'green', "The new song has been successfuly added to the database!");
}