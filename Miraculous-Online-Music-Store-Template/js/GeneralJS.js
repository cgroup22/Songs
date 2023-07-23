const port = "44355"; // port of the server.
const apiStart = `https://localhost:${port}/api`; // host url.
$(document).ready(function() { // onload. Updates playlists and search.
    $("#SearchForm").submit(SearchQuery);
    document.getElementsByClassName('nav_playlist')[0].children[0].style.display = "none";
    document.getElementsByClassName('nav_playlist')[0].children[1].querySelector('a').href = "javascript:void(0);";
    document.getElementsByClassName('nav_playlist')[0].children[1].querySelector('a').setAttribute('onclick', 'CreatePlaylist()');
    RequestPlaylists(); // gets user playlists if logged in
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
    // If webkit isn't supported - hide mic
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window))
        document.getElementById('MicSVG').style.display = 'none';
});
// logs in if there's a user in our storage. Otherwise, leave page.
function GamesTryLogin() {
    if (!IsLoggedIn()) {
        openPopup('ERROR', "red", 'Log in first!');
        setTimeout(() => {location.href = `index.html`;}, 2000);
        return;
    }
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
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
// Toggles profile options
function ToggleProfile() {
    $(".pro_dropdown_menu").toggleClass("open_dropdown");
}
// alerts error. Used for tests.
function GeneralErrorCallback(e) {
    console.log(e);
    alert(e.responseJSON.message);
}
// Tries to login, if not logged in, stays on the same page.
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
// On error, opens popup for the user
function ECB(e) {
    console.log(e)
    //alert(e);
    if (e != undefined && e.responseJSON != undefined && e.responseJSON.message != undefined)
        openPopup("ERROR", "red", e.responseJSON.message);
}
// opens popup with the requested title, color, and text.
function openPopup(popupTitle, popupTitleColor, popupText) {
  document.body.classList.add("no-scroll");
  document.getElementById("popup").style.display = "block";
  document.getElementById("PopupTitle").innerHTML = popupTitle;
  document.getElementById("PopupTitle").style.color = popupTitleColor;
  document.getElementById("PopupText").innerHTML = popupText;
}
// hides popup
function closePopup() {
  document.body.classList.remove("no-scroll");
  document.getElementById("popup").style.display = "none";
}
// hides audio player
function HideAudioPlayer() {
  document.getElementsByClassName('ms_player_wrapper')[0].style.visibility = 'hidden';
}
// shows audio player
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
// Adds song to queue.
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
        return new Promise(function(resolve, reject) { // returns a promise because we'd like to give time for the db to get the song.
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
  // Saves search query, and moves to search page, which will search the query on the db.
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
  // Hides more options inside the queue. User have more options onclick on the songs name.
  function HideMoreOptions() {
    for (i of document.getElementsByClassName('que_more'))
        i.style.display = "none";
    UpdateRemoveFromQueue();
  }
  // Toggles queue song repeat
  function ToggleRepeat() {
    if (!IsLooped)
        $('#LoopSVG').attr('style', 'background-color: green !important');
    else $('#LoopSVG').attr('style', 'background-color: transparent');
    IsLooped = !IsLooped;
  }
  // Removes song from queue button
  function UpdateRemoveFromQueue() {
    // console.log(document.getElementsByClassName('que_close'));
    let ar = document.getElementsByClassName('que_close');
    for (i in ar) {
        if (typeof ar[i] === "number")
            break;
        ar[i].setAttribute('onclick', `RemoveSongFromQueue(${i})`);
    }
  }
  // Removes song from queue
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
  // Clears queue and hides audio player and stops current playing song
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
// gets the lyrics of the chosen song
function getLyrics(SongID) {
  const api = `${apiStart}/Songs/GetSongLyrics/SongID/${SongID}`;
  ajaxCall("GET", api, "", getLyricsSCB, (e) => { openPopup("ERROR", "red", "Couldn't retrieve song lyrics"); console.log(e); });
}
// shows popup with the lyrics of the song
function getLyricsSCB(data) {
  // console.log(data);
  // openPopup(data.SongName, "white", data.Lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>'));
  const overlay = document.getElementById('lyrics-overlay');
  if (overlay == undefined) {
    openPopup(data.SongName, "white", data.Lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>'));
    return;
  }
  const closeButton = document.getElementById('close-button');
  const lyricsText = document.getElementById('lyrics-text');
  const body = document.body;

  document.getElementById("songLyrics").textContent = data.SongName;
  document.getElementById("songLyrics").style.marginBottom = "20px";
  lyricsText.innerHTML = data.Lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>');
  overlay.style.display = 'flex';
  closeButton.addEventListener('click', function () {
    overlay.style.display = 'none';
  });
  TextToSpeech(`${data.SongName} by ${data.PerformerName}`);
}
// downloads the requested song
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
  // Toggles more options of element.
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
// hides more options
function TurnOffMoreOptions() {
    for (i of document.getElementsByClassName('SongMO')) {
        i.style.visibility = "hidden";
        i.style.opacity = "0"; }
}
// gets playlists of user
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
// updates playlists of user in html dynamically
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
// move to playlist page
function getPlaylist(PlaylistID) {
    // console.log(PlaylistID);
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
// Creates a new playlist
function CreatePlaylist() {
    let UserID = GetUserID();
    if (undefined == UserID || isNaN(UserID) || null == UserID || UserID < 1) {
        openPopup("ERROR", 'red', 'Login first!');
        return;
    }
    document.getElementById('CreatePlaylistPopup').style.display = 'flex';
}
// Cancel creating a new playlist button
function CreatePlaylistCancel() {
    document.getElementById('CreatePlaylistPopup').style.display = 'none';
}
// Creates a playlist on db
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
// Moves to playlist new page
function CreatePlaylistSCB(data) {
    document.getElementById('CreatePlaylistPopup').style.display = 'none';
    if (data.playlistID >= 1) {
        sessionStorage['PlaylistID'] = data.playlistID;
        window.location.href = 'playlist.html';
    }
}
// Get youtube link for the song, using YouTube's API.
async function OpenOnYT(song, artist) {
    const apiKey = 'AIzaSyAUBDnPCnsMDLrpjpfT9RNnIi25AQD65B8';
    const formattedSongName = encodeURIComponent(song);
    const formattedArtistName = encodeURIComponent(artist);
    const songNameSearch = song.replace(/\s/g, '+');
    const artistNaeSearch = artist.replace(/\s/g, '+');
    const apiUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${formattedSongName} ${formattedArtistName}&key=${apiKey}`;
    const YTSearchUrl = `https://www.youtube.com/results?search_query=${songNameSearch} ${artistNaeSearch}`;
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        // Retrieve the video ID of the first search result
        const videoId = data.items[0].id.videoId;
        // Construct the YouTube video URL
        const YTLink = `https://www.youtube.com/watch?v=${videoId}`;
        const link = YTLink;
        window.open(link, '_blank');
    } catch (error) {
        console.log(error);
        return YTSearchUrl;
    }
}
// cancel add song to playlist (hide popup)
function AddToPlaylistCancel() {
    document.getElementById('AddToPlaylistPopup').style.display = 'none';
}
// Adds song to playlist
function AddToPlaylistOK(pid) {
    if (SongIDATP == undefined) return;
    const api = `${apiStart}/Playlists/InsertSongToPlaylist`;
    let SongInPlaylist = {
        playlistID: pid,
        songID: SongIDATP
    };
    ajaxCall("PUT", api, JSON.stringify(SongInPlaylist), AddToPlaylistSCB, AddToPlaylistECB);
}
// Adds song to playlist, updates elems
function ATP(sid) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "Login first!");
        return;
    }
    document.getElementById('AddToPlaylistPopup').style.display = 'flex';
    document.getElementById('AddedToPlaylistInfo').style.display = `none`;
    SongIDATP = sid;
}
// Adds song to playlist sucess callback, updates elems
function AddToPlaylistSCB() {
    let elem = document.getElementById('AddedToPlaylistInfo');
    elem.innerHTML = `Added`;
    elem.style.display = `block`;
    elem.style.color = 'green';
}
// Adds to playlist error. Shows the error to the user on AddedToPlaylistInfo elem
function AddToPlaylistECB(e) {
    let elem = document.getElementById('AddedToPlaylistInfo');
    elem.innerHTML = e.responseJSON.message;
    elem.style.display = `block`;
    elem.style.color = 'red';
}
// Plays artist songs without shuffling the queue.
function PlayArtistSongsWithoutShuffle(PID) {
  // console.log(PID)
  let UserID = GetUserID();
  const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}/UserID/${UserID}`;
  ajaxCall("GET", api, "", PlayArtistSongsWithoutShuffleSCB, ECB);
}
// Moves to following list page. (Only if the user is logged in!)
function MoveToFollowing() {
    if (!IsLoggedIn()) {
        openPopup('ERROR', 'red', "You must be logged in!");
        return;
    }
    window.location.href = 'following.html';
}
// Plays all of the songs of a specific artist, also saves them to the queue.
function PlayArtistSongsWithoutShuffleSCB(data) {
  window.myPlaylist.playlist = [];
  window.myPlaylist.original = [];
  //console.log(data);
  let song;
  for (i in data) {
      song = {
          image: data[i].performerImage,	
          title: data[i].songName,
          artist: data[i].performerName,
          mp3: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
          oga: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
          option : window.myPlayListOtion
      };
      window.myPlaylist.playlist.push(song);
      window.myPlaylist.original.push(song);
  }
  window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
  localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
  HandleIndexPlayFirstInQueue();
  PlayFirstInQueue();
}
// logs in if there's anything in the storage, moves to index.html if the user is not logged in
function FavoriteTryLogin() {
    if (!IsLoggedIn()) {
        openPopup('ERROR', "red", 'Log in first!');
        setTimeout(() => {location.href = `index.html`;}, 2000);
        return;
    }
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
// Adds the current playing song to favorites
function AddCurrentPlayingSongToFavorites(SongID) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "You're not logged in!");
        return;
    }
    let UserID = GetUserID();
    const api = `${apiStart}/Users/PostUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("POST", api, "", AddCurrentPlayingSongToFavoritesSCB, ECB);
  }
  // Updates elem of current playing song.
  function AddCurrentPlayingSongToFavoritesSCB() {
    let elem = document.getElementsByClassName('play_song_options')[0].children[0].children[1];
    elem.querySelector('a').innerHTML = `<span class="song_optn_icon"><i class="ms_icon icon_fav"></i></span>Unfavourite`;
    elem.setAttribute('onclick', 'DeleteCurrentPlayingSongFromFavorites()');
  }
  // Removes current playing song from favorites
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
  // Updates html elem of current playing song. Gives the user the option to now add the song again.
  function DeleteCurrentPlayingSongFromFavoritesSCB() {
    let index = window.myPlaylist.current;
    let tmpArr = window.myPlaylist.playlist[index].mp3.split('/');
    let SongID = tmpArr[tmpArr.length - 1];
    let elem = document.getElementsByClassName('play_song_options')[0].children[0].children[1];
    elem.querySelector('a').innerHTML = `<span class="song_optn_icon"><i class="ms_icon icon_fav"></i></span>Add To Favourites`;
    elem.setAttribute('onclick', `AddCurrentPlayingSongToFavorites(${SongID})`);
  }
  // If not logged in, shows popup when trying to reach the favorites page
  function LoginToFavorite() {
    openPopup("ERROR", "red", "Log in to add songs to your favorites!");
  }
  // Go into chosen artist page.
  function MoveToArtist(id) {
    if (typeof id != "number" || id < 1) return;
    let Artist = {
        id: id
    };
    sessionStorage['Artist'] = JSON.stringify(Artist);
    window.location.href = 'sartist.html';
}
// Inserts song to queue as first and plays
function UnshiftToQueueAndPlay(Song) {
    let songToAdd = {
        image: Song.performerImage,
        title: Song.songName,
        artist: Song.performerName,
        mp3: `${apiStart}/Songs/GetSongByID/SongID/${Song.songID}`,
        oga: `${apiStart}/Songs/GetSongByID/SongID/${Song.songID}`,
		option : window.myPlayListOtion
    };
    if(IsSongInQueueByNameAndArtist(Song.performerName, Song.songName)) {
        for (i in window.myPlaylist.playlist) {
            if (window.myPlaylist.playlist[i].title === songToAdd.title && window.myPlaylist.playlist[i].artist == songToAdd.artist) {
                window.myPlaylist.playlist.splice(parseInt(i), 1);
                window.myPlaylist.playlist.unshift(songToAdd);
                window.myPlaylist.original = window.myPlaylist.playlist;
                window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
                PlayFirstInQueue();
                break;
            }
        }
    } else {
        window.myPlaylist.playlist.unshift(songToAdd);
        window.myPlaylist.original.unshift(songToAdd);
        window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
        PlayFirstInQueue();
    }
}
// Move to favorites page. If not logged in, popup error.
function MoveToFavorites() {
    if (!IsLoggedIn()) {
        openPopup('ERROR', 'red', 'Login first!');
        return;
    }
    window.location.href = 'favourite.html';
}
// Move to solo quiz page. If not logged in, popup error.
function TakeAQuiz() {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "Login first");
        return;
    }
    window.location.href = 'quiz.html';
}
// Move to quiz history page. If not logged in, popup error.
function MoveToQuizHistory() {
    if (!IsLoggedIn()) {
        openPopup("ERROR", 'red', 'Login first!');
        return;
    }
    window.location.href = 'quizhistory.html';
}
// Move to multiplayer quiz. If not logged in or not verified, popup error.
function MPQuiz() {
    if (!IsLoggedIn()) {
        openPopup("ERROR", 'red', 'Login first!');
        return;
    }
    const api = `${apiStart}/Users/IsUserVerified/id/${GetUserID()}`;
    ajaxCall("GET", api, MPQuizSCB, (e) => { if (typeof e === "boolean") MPQuizSCB(e); else console.log(e); /*window.location.href = 'MultiplayerQuizzes.html';*/ });
}
// Moves to multiplayer quiz page if user is verified.
function MPQuizSCB(data) {
    if (!data) {
        openPopup("ERROR", 'red', 'You must be verified to play multiplayer!');
        return;
    }
    window.location.href = 'MultiplayerQuizzes.html';
}
// Plays the chosen artists songs.
function PlayArtist(PID) {
    // console.log(PID)
    let UserID = GetUserID();
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}/UserID/${UserID}`;
    ajaxCall("GET", api, "", PlayPerformerSongsSCB, ECB);
    // TODO: play artist's first song and save other songs to the queue
}
// Plays all of the songs of a specific artist, also saves them to the queue.
function PlayPerformerSongsSCB(data) {
    // Randomize the queue
    shuffle(data);
    window.myPlaylist.playlist = [];
    window.myPlaylist.original = [];
    //console.log(data);
    let song;
    for (i in data) {
        song = {
            image: data[i].performerImage,	
            title: data[i].songName,
            artist: data[i].performerName,
            mp3: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
            oga: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
            option : window.myPlayListOtion
        };
        window.myPlaylist.playlist.push(song);
        window.myPlaylist.original.push(song);
    }
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    HandleIndexPlayFirstInQueue();
    PlayFirstInQueue();
}
// Updates elems of current playing song.
function HandleIndexPlayFirstInQueue() {
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    if (document.getElementsByClassName('ms_active_play').length > 0)
    document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility = 'visible';
  }
  // If there's a queue with song, updates html. Otherwise, hide audio player.
  function CheckAudioPlayer() {
    let Q = localStorage['Queue'];
    if (Q == "" || Q == undefined) {
        HideAudioPlayer(); // Hide audio player if there's no queue.
    }
    else {
        let tmp = JSON.parse(Q); // tmp is the user's Q saved in our localStorage
        window.myPlaylist.playlist = tmp;
        window.myPlaylist.original = tmp;
        window.myPlaylist.setPlaylist(tmp);
        document.getElementById('AudioPlayerSongInfo').innerHTML = `<div class="jp-track-name" id="AudioPlayerSongInfo">
        <span class="que_img"><img src="${tmp[0].image}"></span><div class="que_data">${tmp[0].title}
        <div class="jp-artist-name">${tmp[0].artist}</div></div></div>`;
    }
}
// Tries to login without error popup.
function SearchTryLogin() {
  if (!IsLoggedIn()) {
      // TODO
      //openPopup('ERROR', "red", 'Log in first!');
      //setTimeout(() => {location.href = `index.html`;}, 2000);
      return;
  }
  let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
  document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
  //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
  `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
  document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
// Calls huggingface's API to get the title and artist of song as audio (Using AI)
async function TextToSpeech(text) {
        const response = await fetch("https://alphonsebrandon-speecht5-tts-demo.hf.space/run/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                data: [
                    text,
                    "SLT (female)",
                ]
            })
        });
    
        const responseData = await response.json();
        // console.log(responseData);
        // Assuming you have the response data in a variable called 'responseData'
    const wavUrl = `https://alphonsebrandon-speecht5-tts-demo.hf.space/file=${responseData.data[0].name}`;
    
    // Create an audio element
    const audioElement = new Audio(wavUrl);
    
    // Play the audio
    audioElement.play();
}
// adds artist to queue
function AddArtistToQueue(PID) {
    let UserID = GetUserID();
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}/UserID/${UserID}`;
    ajaxCall("GET", api, "", SearchAddArtistToQueueSCB, ECB);
}
// Plays all of the songs of a specific artist, also saves them to the queue.
function SearchAddArtistToQueueSCB(data) {
    // Randomize the queue
    shuffle(data);
    let song;
    for (i in data) {
        song = {
            image: data[i].performerImage,	
            title: data[i].songName,
            artist: data[i].performerName,
            mp3: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
            oga: `${apiStart}/Songs/GetSongByID/SongID/${data[i].songID}`,
            option : window.myPlayListOtion
        };
        window.myPlaylist.playlist.push(song);
        window.myPlaylist.original.push(song);
    }
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    // Testing
    /*let audioPlayer = document.getElementsByClassName('ms_player_wrapper')[0];
    if (audioPlayer.style.visibility == 'hidden') {
        audioPlayer.style.visibility = 'visible';

    }*/
    CheckAudioPlayer();
    ShowAudioPlayer();
}
// using webkit speech recognition to get user's query by voice. (API developed by Apple)
function SearchByVoice() {
    // Web Speech API is supported
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      const recognition = new SpeechRecognition();
  
      // Set up the recognition language (optional)
      recognition.lang = 'en-US'; // Change to the desired language code
  
      // Start speech recognition
      recognition.start();
  
      // Event triggered when speech recognition receives results
      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        if (transcript == "") {
            return;
        }
        sessionStorage['query'] = transcript;
        window.location.href = 'search.html';
      };
  
      // Event triggered when an error occurs
      recognition.onerror = (event) => {
        console.error('Error occurred in speech recognition: ', event.error);
      };
    } else {
      // Web Speech API is not supported, handle gracefully
      // console.error('Web Speech API is not supported in this browser.');
      document.getElementById('MicSVG').style.display = 'none';
    }
  }
  function Leaderboard() {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "RED", "You need to login to see the leaderboard!");
        return;
    }
    window.location.href = `leaderboard.html`;
  }