// Called when the favorites page is loaded
function PlaylistLoaded() { // Gets playlist songs, updates audio player, and login info.
    // Saves whether we want our queue to loop
    IsLooped = false;
    FavoriteTryLogin();
    UpdatePlaylist();
    CheckAudioPlayer();

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
// Updates playlist songs on html page
function UpdatePlaylist() {
    if (!IsLoggedIn()) return;
    let userID = GetUserID();
    if (userID == null || userID < 1) return;
    if (sessionStorage['PlaylistID'] == undefined || sessionStorage['PlaylistID'] == "") {
        openPopup("ERROR", "red", "You didn't choose a playlist!");
        setTimeout(() => {window.location.href = 'index.html'}, 2000);
        return;
    }
    PlaylistID = sessionStorage['PlaylistID'];
    const api = `${apiStart}/Playlists/GetPlaylistSongs/PlaylistID/${PlaylistID}`;
    ajaxCall("GET", api, "", GetPlaylistSCB, ECB);
    const apiGetName = `${apiStart}/Playlists/GetPlaylistName/PlaylistID/${PlaylistID}`;
    ajaxCall("GET", apiGetName, "", GetNameSCB, PlaylistNameECB);
}
// Sets playlist name on html
function GetNameSCB(name) {
    document.getElementById('PlaylistName').innerHTML = `Playlist "${name.playlistName}"`;
}
// On error, just show "Your Playlist"
function PlaylistNameECB(e) {
    console.log(e);
    document.getElementById('PlaylistName').innerHTML = `Your Playlist`;
}
// Gets playlist songs and updates html dynamically
function GetPlaylistSCB(data) {
    // console.log(data);
    PlaylistSongs = data;
    UpdatePlaylistHTML();
}
// updates html dynamically (with the playlist's songs)
function UpdatePlaylistHTML() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">remove</li></ul>`;
    for (i in PlaylistSongs) {
    str += `<ul>
        <li onclick='PlaylistPlaySong(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)" class="sNames">${PlaylistSongs[i].songName}</a></li>
        <li onclick="MoveToArtist(${PlaylistSongs[i].performerID})"><a href="javascript:void(0)">${PlaylistSongs[i].performerName}</a></li>` +
        `<li class="text-center"><a href="javascript:void(0)">${PlaylistSongs[i].length}</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
            <ul class="more_option SongMO" style="visibility:hidden;">` +
            `<li onclick="AddToQueuePlaylist(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
                <li onclick="DownloadFromPlaylist(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
                <li onclick="ATP(${PlaylistSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
                <li onclick="getLyrics(${PlaylistSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
            </ul>`+
        `<li class="text-center"><a href="javascript:void(0)"><span class="ms_close" onclick="RemoveFromPlaylist(${PlaylistID}, ${PlaylistSongs[i].songID})">
                <img src="images/svg/close.svg" alt=""></span></a></li>
    </ul>`;
        counter++;
    }
    if (PlaylistSongs.length == 0) {
        str += `<p id="NoFavSongs">None<p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
// Remove song from playlist
function RemoveFromPlaylist(PlaylistID, SongID) {
    RemovedSongID = SongID;
    let userID = GetUserID();
    if (userID == null || userID < 1) return;
    const api = `${apiStart}/Playlists/DeleteSongFromPlaylist/PlaylistID/${PlaylistID}/SongID/${SongID}`;
    ajaxCall("DELETE", api, "", RemoveFromPlaylistSCB, ECB);
}
// on sucess, remove song from playlist songs array and updates html
function RemoveFromPlaylistSCB(result) {
    if (result) {
        for (i in PlaylistSongs)
            if (PlaylistSongs[i].songID == RemovedSongID) {
                PlaylistSongs.splice(parseInt(i), 1);
                break;
            }
        UpdatePlaylistHTML();
    }
}
// Add song to queue
function AddToQueuePlaylist(i) {
    AddToQueue(PlaylistSongs[i]);
}
// Download song
function DownloadFromPlaylist(i) {
    Download(PlaylistSongs[i].songID, PlaylistSongs[i].songName + " by " + PlaylistSongs[i].performerName + ".mp3");
}
// Play song
function PlaylistPlaySong(id) {
    UnshiftToQueueAndPlay(PlaylistSongs[id]);
}
// Play the whole playlist (sets queue songs to be playlist's songs and plays the first song in the playlist)
function PlayPlaylist() {
    let userID = GetUserID();
    if (userID == null || userID < 1 || PlaylistID < 1)
        return;
    if (PlaylistID == undefined)
        return;
    // console.log(PlaylistSongs);
    window.myPlaylist.playlist = [];
    window.myPlaylist.original = [];
    let song;
    for (i in PlaylistSongs) {
        song = {
            image: PlaylistSongs[i].performerImage,	
            title: PlaylistSongs[i].songName,
            artist: PlaylistSongs[i].performerName,
            mp3: `${apiStart}/Songs/GetSongByID/SongID/${PlaylistSongs[i].songID}`,
            oga: `${apiStart}/Songs/GetSongByID/SongID/${PlaylistSongs[i].songID}`,
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
// delete playlist
function DeletePlaylist() {
    let userID = GetUserID();
    if (userID == null || userID < 1 || PlaylistID < 1)
        return;
    const api = `${apiStart}/Playlists/DeleteUserPlaylist/PlaylistID/${PlaylistID}/UserID/${userID}`;
    ajaxCall("DELETE", api, "", DeletePlaylistSCB, ECB);
}
// show popup and move to another page
function DeletePlaylistSCB() {
    //openPopup("Playlist Deleted!", 'green', "Deleted successfuly!");
    setTimeout(() => {window.location.href='index.html'}, 2000);
    const overlay = document.getElementById('lyrics-overlay');
    const closeButton = document.getElementById('close-button');
    const lyricsText = document.getElementById('lyrics-text');
    const body = document.body;

    document.getElementById("songLyrics").textContent = "Playlist deleted";
    document.getElementById("songLyrics").style.marginBottom = "20px";
    lyricsText.innerHTML = "Deleted successfully"
    overlay.style.display = 'flex';



    closeButton.addEventListener('click', function () {
        overlay.style.display = 'none';

    });
}