const port = "44355";
const apiStart = `https://localhost:${port}/api`;
$(document).ready(function() {
    $("#SearchForm").submit(SearchQuery);
    document.getElementsByClassName('nav_playlist')[0].children[0].style.display = "none";
    document.getElementsByClassName('nav_playlist')[0].children[1].querySelector('a').href = "javascript:void(0);";
    document.getElementsByClassName('nav_playlist')[0].children[1].querySelector('a').setAttribute('onclick', 'CreatePlaylist()');
    RequestPlaylists();
    $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        //console.log(document.getElementsByClassName('play_song_options')[0].children[0].children)
        let updateElems = document.getElementsByClassName('play_song_options')[0].children[0].children;
        let index = window.myPlaylist.current;
        // console.log(window.myPlaylist.playlist[index])
        let tmpArr = window.myPlaylist.playlist[index].mp3.split('/');
        let SongID = tmpArr[tmpArr.length - 1];
        updateElems[0].setAttribute('onclick', `Download(${SongID}, "${window.myPlaylist.playlist[index].title} by ${window.myPlaylist.playlist[index].artist}.mp3")`);
        updateElems[1].setAttribute('onclick', `AddCurrentPlayingSongToFavorites(${SongID})`);
        updateElems[2].setAttribute('onclick', `ATP(${SongID})`);
        updateElems[3].setAttribute('onclick', `getLyrics(${SongID})`);
        updateElems[3].querySelector('a').innerHTML = `<span class="song_optn_icon"><i class="ms_icon icon_share"></i></span>Lyrics`;
    });
});
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
function TryLogin() {
    if (!IsLoggedIn()) return; // Returns if the user is not logged in
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    /*document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="upload.html" class="ms_btn">upload</a>`
    + `<a href="javascript:;" class="ms_admin_name">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    `<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a href="#">Logout</a></li></ul>`;*/
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
function ECB(e) {
    console.log(e)
    //alert(e);
    openPopup("ERROR", "red", e.responseJSON.message);
}
function openPopup(popupTitle, popupTitleColor, popupText) {
  document.body.classList.add("no-scroll");
  document.getElementById("popup").style.display = "block";
  document.getElementById("PopupTitle").innerHTML = popupTitle;
  document.getElementById("PopupTitle").style.color = popupTitleColor;
  document.getElementById("PopupText").innerHTML = popupText;
}
function closePopup() {
  document.body.classList.remove("no-scroll");
  document.getElementById("popup").style.display = "none";
}
function HideAudioPlayer() {
  document.getElementsByClassName('ms_player_wrapper')[0].style.visibility = 'hidden';
}
function ShowAudioPlayer() {
  document.getElementsByClassName('ms_player_wrapper')[0].style.visibility = 'visible';
}
// returns true if the song is already in the queue.
function IsSongInQueueByNameAndArtist(artist, title) {
    if (!window.myPlaylist.playlist) return false;
    for (i of window.myPlaylist.playlist)
        if (i.title === title && i.artist === artist)
            return true;
    return false;
}
function AddToQueue(Song) {
    // console.log(Song);
    if(IsSongInQueueByNameAndArtist(Song.performerName, Song.songName)) return;
    let songToAdd = {
        image: Song.performerImage,	
        title: Song.songName,
        artist: Song.performerName,
        mp3: `${apiStart}/Songs/GetSongByID/SongID/${Song.songID}`,
        oga: `${apiStart}/Songs/GetSongByID/SongID/${Song.songID}`,
		option : window.myPlayListOtion
    };
    // console.log(window.myPlayListOtion);
    window.myPlaylist.playlist.push(songToAdd);
    window.myPlaylist.original.push(songToAdd);
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    localStorage["Queue"] = JSON.stringify(window.myPlaylist.playlist);
}
// Plays the first song in the queue. Removes unnecessary html elements.
function PlayFirstInQueue() {
    window.addEventListener('load', function() {
        window.requestAnimationFrame(playSong);
    });
    function playSong() {
        return new Promise(function(resolve, reject) {
            $(document).on($.jPlayer.event.canplay, function() {
                $("#jquery_jplayer_1").jPlayer("play");
                ShowAudioPlayer();
                resolve();
            });
        });
    }
    playSong()
        .then(function() {
            localStorage["Queue"] = JSON.stringify(window.myPlaylist.playlist);
        })
        .catch(function(error) {
            console.error("Error occurred:", error);
        });
}
// shuffles the array (used to randomize the songs queue)
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }
  function SearchQuery() {
    let query = document.getElementById('SearchBar').value;
    if (query == "") {
        document.getElementById('SearchBar').style.border = "3px solid red";
    } else {
        sessionStorage['query'] = query;
        window.location.href = 'search.html';
    }
    return false;
  }
  function HideMoreOptions() {
    for (i of document.getElementsByClassName('que_more'))
        i.style.display = "none";
    UpdateRemoveFromQueue();
  }
  function ToggleRepeat() {
    if (!IsLooped)
        $('#LoopSVG').attr('style', 'background-color: green !important');
    else $('#LoopSVG').attr('style', 'background-color: transparent');
    IsLooped = !IsLooped;
  }
  function UpdateRemoveFromQueue() {
    // console.log(document.getElementsByClassName('que_close'));
    let ar = document.getElementsByClassName('que_close');
    for (i in ar) {
        if (typeof ar[i] === "number")
            break;
        ar[i].setAttribute('onclick', `RemoveSongFromQueue(${i})`);
    }
  }
  function RemoveSongFromQueue(id) {
    window.myPlaylist.playlist.splice(id, 1);
    window.myPlaylist.original.splice(id, 1);
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    if (window.myPlaylist.playlist.length == 0) {
        FavClearQueue();
    }
    else localStorage["Queue"] = JSON.stringify(window.myPlaylist.playlist);
    // window.myPlaylist.remove(id);
  }
  function FavClearQueue() {
    localStorage['Queue'] = "";
    window.myPlaylist.playlist=[];
    window.myPlaylist.original=[];
    window.myPlaylist.setPlaylist([]);
    $("#jquery_jplayer_1").jPlayer("pause");
    HideAudioPlayer();
    if (document.getElementsByClassName('ms_active_play').length > 0)
        document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility='visible';
    for (i of document.getElementsByClassName('play_active_song'))
        i.classList.remove('play_active_song');
}
function getLyrics(SongID) {
  const api = `${apiStart}/Songs/GetSongLyrics/SongID/${SongID}`;
  ajaxCall("GET", api, "", getLyricsSCB, (e) => { openPopup("ERROR", "red", "Couldn't retrieve song lyrics"); console.log(e); });
}
function getLyricsSCB(data) {
  // console.log(data.Lyrics);
  openPopup(data.SongName, "white", data.Lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>'));
}
function Download(SongID, fileName) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "Log in to download!");
        return;
    }
    var xhr = new XMLHttpRequest();
    const api = `${apiStart}/Songs/GetSongByID/SongID/${SongID}`;
    xhr.open("GET", api);
    xhr.responseType = "arraybuffer";
    xhr.onload = function() {
    var mp3FileData = xhr.response;
    var mp3File = new Blob([mp3FileData]);

    // Create a URL object from the Blob object.
    var url = URL.createObjectURL(mp3File);

    // Download the file to the client's computer.
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = fileName;
    anchor.click();
    };
    xhr.send();
  }
  function ToggleMore(elem) {
    let tmp = elem.parentNode.querySelector('ul');
    if (tmp.style.visibility === "hidden") {
        TurnOffMoreOptions();
        tmp.style.visibility = "visible";
        tmp.style.opacity = "1";
    } else {
        tmp.style.visibility = "hidden";
        tmp.style.opacity = "0";
    }
}
function TurnOffMoreOptions() {
    for (i of document.getElementsByClassName('SongMO')) {
        i.style.visibility = "hidden";
        i.style.opacity = "0"; }
}
function RequestPlaylists() {
    let UserID = -1;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        UserID = JSON.parse(localStorage["User"]).id;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        UserID = JSON.parse(sessionStorage["User"]).id;
    if (undefined == UserID || isNaN(UserID) || null == UserID || UserID < 1) {
        return;
    }
    const api = `${apiStart}/Playlists/GetUserPlaylists/UserID/${UserID}`;
    ajaxCall("GET", api, "", RequestPlaylistsSCB, ECB);
}
function RequestPlaylistsSCB(data) {
    // console.log(data);
    UserPlaylists = data;
    let str = ``;
    let AddToPlaylistPopupInfo = ``;
    for (i in data) {
        str += `<li id="Playlist${data[i].id}" onclick="getPlaylist(${data[i].id})"><a href="javascript:void(0);" title="Featured Playlist">
        <span class="nav_icon">
            <span class="icon icon_fe_playlist"></span>
        </span>
        <span class="nav_text">
            ${data[i].name}
        </span>
        </a>
        </li>`;
        AddToPlaylistPopupInfo += `<a href="javascript:void(0)" class="PlaylistOption" onclick="AddToPlaylistOK(${data[i].id})">${data[i].name}</a><br>`;
    }
    if (data.length == 0)
        AddToPlaylistPopupInfo  = `You have no playlists!`;
    document.getElementsByClassName('nav_playlist')[0].innerHTML += str;
    document.getElementById('AddToPlaylistInfo').innerHTML = AddToPlaylistPopupInfo;
}
function getPlaylist(PlaylistID) {
    console.log(PlaylistID);
    sessionStorage['PlaylistID'] = PlaylistID;
    window.location.href = "playlist.html";
}
// Returns the user id if logged in, -1 otherwise.
function GetUserID() {
    let userID = -1;
    if (localStorage['User'] == undefined || localStorage['User'] == "") {
        if (!(sessionStorage['User'] == undefined || sessionStorage['User'] == ""))
            userID = JSON.parse(sessionStorage['User']).id;
    }
    else userID = JSON.parse(localStorage['User']).id;
    return userID;
}
function CreatePlaylist() {
    let UserID = GetUserID();
    if (undefined == UserID || isNaN(UserID) || null == UserID || UserID < 1) {
        openPopup("ERROR", 'red', 'Login first!');
        return;
    }
    document.getElementById('CreatePlaylistPopup').style.display = 'flex';
}
function CreatePlaylistCancel() {
    document.getElementById('CreatePlaylistPopup').style.display = 'none';
}
function CreatePlaylistOK() {
    let val = document.getElementById('playlist-name').value;
    let uID = GetUserID();
    if (uID == null || uID < 1) return;
    if (val == null || val == "") {
        document.getElementById('playlist-name').style.border = '4px solid red';
        return;
    }
    document.getElementById('playlist-name').style.border = '1px solid black';
    let Playlist = {
        "id": 0,
        "name": val,
        "userID": uID
    };
    const api = `${apiStart}/Playlists`;
    ajaxCall("POST", api, JSON.stringify(Playlist), CreatePlaylistSCB, ECB);
}
function CreatePlaylistSCB(data) {
    document.getElementById('CreatePlaylistPopup').style.display = 'none';
    if (data.playlistID >= 1) {
        sessionStorage['PlaylistID'] = data.playlistID;
        window.location.href = 'playlist.html';
    }
}
function AddToPlaylistCancel() {
    document.getElementById('AddToPlaylistPopup').style.display = 'none';
}
function AddToPlaylistOK(pid) {
    if (SongIDATP == undefined) return;
    const api = `${apiStart}/Playlists/InsertSongToPlaylist`;
    let SongInPlaylist = {
        playlistID: pid,
        songID: SongIDATP
    };
    ajaxCall("PUT", api, JSON.stringify(SongInPlaylist), AddToPlaylistSCB, AddToPlaylistECB);
}
function ATP(sid) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "Login first!");
        return;
    }
    document.getElementById('AddToPlaylistPopup').style.display = 'flex';
    document.getElementById('AddedToPlaylistInfo').style.display = `none`;
    SongIDATP = sid;
}
function AddToPlaylistSCB() {
    let elem = document.getElementById('AddedToPlaylistInfo');
    elem.innerHTML = `Added`;
    elem.style.display = `block`;
    elem.style.color = 'green';
}
function AddToPlaylistECB(e) {
    let elem = document.getElementById('AddedToPlaylistInfo');
    elem.innerHTML = e.responseJSON.message;
    elem.style.display = `block`;
    elem.style.color = 'red';
}
function AddCurrentPlayingSongToFavorites(SongID) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "You're not logged in!");
        return;
    }
    let UserID = GetUserID();
    const api = `${apiStart}/Users/PostUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("POST", api, "", AddCurrentPlayingSongToFavoritesSCB, ECB);
  }
  function AddCurrentPlayingSongToFavoritesSCB() {
    let elem = document.getElementsByClassName('play_song_options')[0].children[0].children[1];
    elem.querySelector('a').innerHTML = `<span class="song_optn_icon"><i class="ms_icon icon_fav"></i></span>Unfavourite`;
    elem.setAttribute('onclick', 'DeleteCurrentPlayingSongFromFavorites()');
  }
  function DeleteCurrentPlayingSongFromFavorites() {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "You're not logged in!");
        return;
    }
    let UserID = GetUserID();
    let index = window.myPlaylist.current;
    let tmpArr = window.myPlaylist.playlist[index].mp3.split('/');
    let SongID = tmpArr[tmpArr.length - 1];
    const api = `${apiStart}/Users/DeleteUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("DELETE", api, "", DeleteCurrentPlayingSongFromFavoritesSCB, ECB);
  }
  function DeleteCurrentPlayingSongFromFavoritesSCB() {
    let index = window.myPlaylist.current;
    let tmpArr = window.myPlaylist.playlist[index].mp3.split('/');
    let SongID = tmpArr[tmpArr.length - 1];
    let elem = document.getElementsByClassName('play_song_options')[0].children[0].children[1];
    elem.querySelector('a').innerHTML = `<span class="song_optn_icon"><i class="ms_icon icon_fav"></i></span>Add To Favourites`;
    elem.setAttribute('onclick', `AddCurrentPlayingSongToFavorites(${SongID})`);
  }