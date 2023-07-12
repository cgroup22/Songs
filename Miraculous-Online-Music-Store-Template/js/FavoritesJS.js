function FavoriteTryLogin() {
    if (!IsLoggedIn()) {
        // TODO
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
function UpdateFavorites() {
    if (!IsLoggedIn()) return;
    let userID = -1;
    if (localStorage['User'] == undefined || localStorage['User'] == "")
        userID = JSON.parse(sessionStorage['User']).id;
    else userID = JSON.parse(localStorage['User']).id;
    if (userID < 1) return;
    const api = `${apiStart}/Users/GetUserFavorites/UserID/${userID}`;
    ajaxCall("GET", api, "", GetFavoritesSCB, ECB);
}
function GetFavoritesSCB(data) {
    // console.log(data);
    FavoriteSongs = data;
    UpdateFavSongs();
}
function UpdateFavSongs() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">Add To Queue</li><li class="text-center">remove</li></ul>`;
    for (i in FavoriteSongs) {
        str += `<ul>
        <li onclick='FavoritePlaySong(${i})'><a href="#"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li><a href="#">${FavoriteSongs[i].songName}</a></li>
        <li><a href="#">${FavoriteSongs[i].performerName}</a></li>` +
        //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${FavoriteSongs[i].length}</a></li>
        <li style="text-align:center;" onclick="AddToQueueFav(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add</a></li>`+
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        `<li class="text-center"><a href="#"><span class="ms_close" onclick="RemoveFromFavorites(${FavoriteSongs[i].songID})">
                <img src="images/svg/close.svg" alt=""></span></a></li>
    </ul>`;
        counter++;
    }
    if (FavoriteSongs.length == 0) {
        str += `<p id="NoFavSongs">None<p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
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
        document.getElementById('AudioPlayerSongInfo').innerHTML = `<div class="jp-track-name">
        <span class="que_img"><img src="${tmp[0].image}"></span><div class="que_data">${tmp[0].title}
        <div class="jp-artist-name">${tmp[0].artist}</div></div></div>`;
    }
}
function RemoveFromFavorites(SongID) {
    RemovedSongID = SongID;
    let userID = -1;
    if (localStorage['User'] == undefined || localStorage['User'] == "")
        userID = JSON.parse(sessionStorage['User']).id;
    else userID = JSON.parse(localStorage['User']).id;
    if (userID < 1) return;
    const api = `${apiStart}/Users/DeleteUserFavorite/UserID/${userID}/SongID/${SongID}`;
    ajaxCall("DELETE", api, "", RemoveFromFavoritesSCB, ECB);
}
function RemoveFromFavoritesSCB(result) {
    if (result) {
        for (i in FavoriteSongs)
            if (FavoriteSongs[i].songID == RemovedSongID) {
                FavoriteSongs.splice(parseInt(i), 1);
                break;
            }
        UpdateFavSongs();
    }
}
function FavoritePlaySong(id) {
    UnshiftToQueueAndPlay(FavoriteSongs[id]);
}
function AddToQueueFav(i) {
    AddToQueue(FavoriteSongs[i]);
}
function FavLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    FavoriteTryLogin();
    UpdateFavorites();
    CheckAudioPlayer();
}
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