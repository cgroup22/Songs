// Called when the favorites page is loaded
function FavLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    FavoriteTryLogin(); // logs in if there's anything in the storage, moves to index.html if the user is not logged in
    UpdateFavorites(); // ajax to get favorites and updates the page
    CheckAudioPlayer(); // updates queue if not empty

    // Takes care of updating html elements on play and adding/removing songs from the queue.
    $("#jquery_jplayer_1").bind($.jPlayer.event.play, function (event) {
        let tmp = document.getElementById('FavoritesContainer');
        let index = window.myPlaylist.current;
        for (i of tmp.children) {
            if (!i.classList.contains('album_list_name')) {
                if (i.querySelector('.sNames').innerHTML === window.myPlaylist.playlist[index].title) {
                    i.classList.add('play_active_song');
                }
                else if (i.classList.contains('play_active_song'))
                    i.classList.remove('play_active_song');
            }
        }
      });
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        HideMoreOptions();
      });
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
// ajax call to get users favorites
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
// updates html elems
function GetFavoritesSCB(data) {
    // console.log(data);
    FavoriteSongs = data;
    UpdateFavSongs();
}
// updates html elems
function UpdateFavSongs() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">remove</li></ul>`;
    for (i in FavoriteSongs) {
    str += `<ul>
        <li onclick='FavoritePlaySong(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li onclick="getLyrics(${FavoriteSongs[i].songID})"><a href="javascript:void(0)" class="sNames">${FavoriteSongs[i].songName}</a></li>
        <li onclick="MoveToArtist(${FavoriteSongs[i].performerID})"><a href="javascript:void(0)">${FavoriteSongs[i].performerName}</a></li>` +
        //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${FavoriteSongs[i].length}</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
            <ul class="more_option SongMO" style="visibility:hidden;">` +
            `<li onclick="AddToQueueFav(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
                <li onclick="DownloadFav(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
                <li onclick="ATP(${FavoriteSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
                <li onclick="getLyrics(${FavoriteSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
            </ul>`+
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        `<li class="text-center"><a href="javascript:void(0)"><span class="ms_close" onclick="RemoveFromFavorites(${FavoriteSongs[i].songID})">
                <img src="images/svg/close.svg" alt=""></span></a></li>
    </ul>`;
        counter++;
    }
    if (FavoriteSongs.length == 0) {
        str += `<p id="NoFavSongs">None</p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
// ajax call to delete a song from users favorites
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
// deletes the song from html if delete from db successded.
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
// Plays the chosen song.
function FavoritePlaySong(id) {
    UnshiftToQueueAndPlay(FavoriteSongs[id]);
}
// Adds the chosen song to favorites
function AddToQueueFav(i) {
    AddToQueue(FavoriteSongs[i]);
}
// Downloads the chosen song.
function DownloadFav(i) {
    Download(FavoriteSongs[i].songID, FavoriteSongs[i].songName + " by " + FavoriteSongs[i].performerName + ".mp3");
}