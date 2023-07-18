// Called when the favorites page is loaded
function ArtLoaded() {
    if (sessionStorage['Artist'] == undefined || sessionStorage['Artist'] == "") {
        openPopup("ERROR", 'red', 'Choose artist first!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    // Saves whether we want our queue to loop
    IsLooped = false;
    Artist = JSON.parse(sessionStorage['Artist']);
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
    document.addEventListener('keydown', function(event) {
        // Check if the pressed key is the escape key
        if (event.key === 'Escape') {
          let LoginForm = document.getElementById('myModal1');
          let RegisterForm = document.getElementById('myModal');
          let bIsPopupOpen = $(LoginForm).hasClass('show') || $(RegisterForm).hasClass('show');
          if (bIsPopupOpen) {
            $('#myModal1').modal('hide');
            $('#myModal').modal('hide');
          }
        }
      });
      $('#myModal1').on('hidden.bs.modal', function () {
        RemoveErrorMesseages();
      });
      
      $('#myModal').on('hidden.bs.modal', function () {
        RemoveErrorMesseages();
      });
    TryLoginFromArtist();
    UpdateArtist();
    CheckAudioPlayer();
    GetTotalPlaysOfArtist();
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
function GetArtistInfoFromLastFM(queryArtistName) {
    const apiKey = 'cdd5f93673066c226a1250d12317c85d';
const artistName = queryArtistName;

const apiUrl = `http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
  artistName
)}&api_key=${apiKey}&format=json`;

fetch(apiUrl)
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // Process the data here, e.g., access data.artist to extract relevant information
    // console.log(data);
    // console.log(data.artist.bio.content);
    // console.log(data.artist.bio.summary);
    document.getElementById('ArtistSummary').innerHTML = data.artist.bio.summary;
  })
  .catch(error => {
    console.error('Error:', error.message);
  });
}
function TryLoginFromArtist() {
    if (!IsLoggedIn()) {
        return;
    }
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
function UpdateArtist() {
    let UserID = GetUserID();
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${Artist.id}/UserID/${UserID}`;
    ajaxCall("GET", api, "", UpdateArtistSCB, ECB);
}
function UpdateArtistSCB(data) {
    if (data.length == 0) return;
    GetConcerts(data[0].performerName);
    document.title = `${data[0].performerName}'s Information`;
    GetArtistInfoFromLastFM(data[0].performerName);
    document.getElementById('ArtistName').innerHTML = data[0].performerName;
    document.getElementById('TopArtistPage').querySelector('img').src = data[0].performerImage;
    // console.log(data);
    ArtistSongs = data;
    UpdateArtistSongs();
}
function UpdateArtistSongs() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">Favorite</li></ul>`;
    for (i in ArtistSongs) {
    str += `<ul>
        <li onclick='ArtistPlaySong(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li onclick="getLyrics(${ArtistSongs[i].songID})"><a href="javascript:void(0)" class="sNames">${ArtistSongs[i].songName}</a></li>
        <li><a href="javascript:void(0)">${ArtistSongs[i].performerName}</a></li>` +
        //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${ArtistSongs[i].songLength}</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
            <ul class="more_option SongMO" style="visibility:hidden;">` +
            `<li onclick="AddToQueueFav(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
                <li onclick="DownloadFromArtist(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
                <li onclick="ATP(${ArtistSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
                <li onclick="getLyrics(${ArtistSongs[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
            </ul>`;
        if (IsLoggedIn() && ArtistSongs[i].isInFavorites == 0) {
            str += `<li onclick="ArtistAddSongToFavorites(${ArtistSongs[i].songID}, this)" class="text-center"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
        }
        else if (IsLoggedIn() && ArtistSongs[i].isInFavorites == 1) // Unfavorite
            str += `<li onclick="ArtistDeleteSongFromFavorites(${ArtistSongs[i].songID}, this)" class="text-center"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite</a></li>`;
        else str += `<li onclick="LoginToFavorite()" class="text-center"><a href="javascript:void(0)"><span class="opt_icon text-center"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        //`<li class="text-center"><a href="javascript:void(0)"><span class="ms_close" onclick="RemoveFromFavorites(${ArtistSongs[i].songID})">
            //    <img src="images/svg/close.svg" alt=""></span></a></li>
    str += `</ul>`;
        counter++;
    }
    if (ArtistSongs.length == 0) {
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
function ArtistPlaySong(id) {
    UnshiftToQueueAndPlay(ArtistSongs[id]);
}
function AddToQueueFav(i) {
    AddToQueue(ArtistSongs[i]);
}
function DownloadFromArtist(i) {
    Download(ArtistSongs[i].songID, ArtistSongs[i].songName + " by " + ArtistSongs[i].performerName + ".mp3");
}
function ArtistAddSongToFavorites(SongID, elem) {
    let UserID = -1;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        UserID = JSON.parse(localStorage["User"]).id;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        UserID = JSON.parse(sessionStorage["User"]).id;
    if (!IsLoggedIn() || typeof UserID != "number" || UserID < 1) {
        openPopup("ERROR", "red", "You're not logged in!");
        return;
    }
    elem.setAttribute('SongID', SongID);
    tmpElem = elem;
    const api = `${apiStart}/Users/PostUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("POST", api, "", ArtistAddSongToFavoritesSCB, ECB);
  }
  function ArtistAddSongToFavoritesSCB(data) {
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
    // console.log(tmpElem)
    tmpElem.setAttribute('onclick', `ArtistDeleteSongFromFavorites(${tmpElem.getAttribute('SongID')}, this)`);
  }
  function ArtistDeleteSongFromFavorites(id, elem) {
    elem.setAttribute('SongID', id);
    let UserID = -1;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        UserID = JSON.parse(localStorage["User"]).id;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        UserID = JSON.parse(sessionStorage["User"]).id;
    else {
        openPopup("ERROR", "red", "Login is required!");
        return;
    }
    tmpElem = elem;
    const api = `${apiStart}/Users/DeleteUserFavorite/UserID/${UserID}/SongID/${id}`;
    ajaxCall("DELETE", api, "", ArtistDeleteSongFromFavoritesSCB, ECB);
  }
  function ArtistDeleteSongFromFavoritesSCB(res) {
    // console.log(res);
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites`;
    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    tmpElem.setAttribute('onclick', `ArtistAddSongToFavorites(${SongID}, this)`);
    //elem.setAttribute
  }
  function GetTotalPlaysOfArtist() {
    const api = `${apiStart}/Performers/GetTotalStreamsOfPerformer/PerformerID/${Artist.id}`;
    ajaxCall("GET", api, "", GetTotalPlaysOfArtistSCB, (err) => { console.log(err); });
  }
  function GetTotalPlaysOfArtistSCB(data) {
    document.getElementById('TotalStreams').innerHTML = `Total Plays: ${data.totalPlays}`;
    document.getElementById('TotalStreams').style.display = `block`;
  }
  function GetConcerts(artistName) {
    $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artistName}&apikey=sGS4leVOIAuCcazajk6HxuSuvPhcaoCu`,
        async:true,
        dataType: "json",
        success: function(json) {
                    console.log(json);
                    if (undefined == json._embedded) {
                        document.getElementById('concerts').style.display = 'block';
                        document.getElementById('concerts').innerHTML = `<p id="NoConcerts">${artistName} has no concerts at this time!</p>`;
                        return;
                    }
                    document.getElementById('concerts').style.display = 'block';
                    let str = `<div class="ms_heading"><h1 id="ConcertsTitle">Concerts</h1></div><div class="album_inner_list"><div class="album_list_wrapper">`;
                    str += `<ul class="album_list_name"><li>#</li><li>Name</li><li>Date</li><li class="text-center">Location</li><li class="text-center">Genre</li><li class="text-center">Buy tickets</li></ul>`;
                    let counter = 1;
                    for (i of json._embedded.events) {
                        if (i.type == "event") {
                            str += `<ul>
                            <li><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
                            <li style="text-align:left;"><a href="javascript:void(0)" class="sNames">${i.name}</a></li>
                            <li><a href="javascript:void(0)">${i.dates.start.localDate} @ ${i.dates.start.localTime}</a></li>` +
                            `<li style="text-align:left;"><a href="javascript:void(0)">${i._embedded.venues[0].country.name}, ${i._embedded.venues[0].city.name}</a></li>
                            <li><a href="javascript:void(0)">${i.classifications[0].genre.name}</a></li>
                            <li class="text-center ms_more_icon" onclick=""><a href="${i.url}" target="_blank">Buy</a></ul>`;
                            counter++;
                        }
                    }
                    str += `</div></div>`;
                    document.getElementById('concerts').innerHTML = str;
                 },
        error: function(xhr, status, err) {
                    document.getElementById('concerts').style.display = 'none';
                 }
      });
  }