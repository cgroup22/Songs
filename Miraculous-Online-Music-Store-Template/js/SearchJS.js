function SearchLoaded() {
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
    SearchTryLogin();
    // Saves whether we want our queue to loop
    IsLooped = false;
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
      // סוף הטפסים
    CheckAudioPlayer();
    if (sessionStorage['query'] == "" || sessionStorage['query'] == undefined) {
        //alert("Search something first");
        return;
    }
    $("#jquery_jplayer_1").bind($.jPlayer.event.play, function (event) {
        let tmpArr = [document.getElementById('SearchSongsContainer'), document.getElementById('SearchGenreContainer'), document.getElementById('SearchLyricsContainer')];
        for (tmp of tmpArr)
        for (i of tmp.children) {
            if (!i.classList.contains('album_list_name')) {
                if (i.querySelector('.sNames').innerHTML === window.myPlaylist.playlist[0].title) {
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
    document.getElementById('ResultsTitle').innerHTML = `Results For "${sessionStorage['query']}"`;
    if (sessionStorage['query'].split(' ') > 1)
        document.getElementById('SongContains').innerHTML = `Songs That Contains The Words "${sessionStorage['query']}"`;
    else document.getElementById('SongContains').innerHTML = `Songs That Contains The Word "${sessionStorage['query']}"`;
    Search(sessionStorage['query']);
}
function Search(query) {
    let UserID = -1;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        UserID = JSON.parse(localStorage["User"]).id;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        UserID = JSON.parse(sessionStorage["User"]).id;
    const api = `${apiStart}/Songs/Search/query/${query}/UserID/${UserID}`;
    ajaxCall("GET", api, "", SearchSCB, ECB);
}
function SearchSCB(data) {
    let query = sessionStorage['query'];
    SearchedResults = data;
    // console.log(data);
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">Streams</li></ul>`;
    for (i in data) {
        if (data[i].songName.toLowerCase().includes(query.toLowerCase())) {
            str += `<ul>
        <li onclick='SearchAddToQueue(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
        <li><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
        //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${data[i].length}</a></li>
        `+`<li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
        <ul class="more_option SongMO" style="visibility:hidden;">`;
            if (data[i].isInFavorites == 0)
            str += `
            <li onclick="SearchAddSongToFavorites(${data[i].songID}, this)"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
            else if (data[i].isInFavorites == -1)
            str += `<li onclick="LoginToFavorite()"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
            else str += `<li onclick="SearchDeleteSongFromFavorites(${data[i].songID}, this)" SongID="${data[i].songID}"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite</a></li>`;
            str += `<li onclick="AddToQueueSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
            <li onclick="DownloadSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
            <li onclick="ATP(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
        </ul>
    </li>`+
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${data[i].numOfPlays}</a></li></ul>`;
            counter++;
        }
    }
    document.getElementById('SearchSongsContainer').innerHTML = str;
    counter = 1;
    let Artists = [];
    let ArtistsSTR = `<ul class="album_list_name"><li>#</li><li>Name</li><li class="text-center">Add To Queue</li></ul>`;
    for (i in data) {
        if (data[i].performerName.toLowerCase().includes(query.toLowerCase()) && !Artists.includes(data[i].performerName.toLowerCase())) {
            Artists.unshift(data[i].performerName.toLowerCase());
            ArtistsSTR += `<ul>
            <li onclick='PlayArtistFromSearch(${data[i].performerID})'><a href="#"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li><a href="javascript:void(0)">${data[i].performerName}</a></li><li style="text-align:center;" onclick="AddArtistToQueue(${data[i].performerID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add</a></li>
            </ul>`;
            counter++;
        }
    }
    document.getElementById('SearchArtistsContainer').innerHTML = ArtistsSTR;
    counter = 1;
    let GenreSearch = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">Genre</li></ul>`;
    for (i in data) {
        if (data[i].genreName.toLowerCase().includes(query.toLowerCase())) {
            GenreSearch += `<ul>
            <li onclick='SearchAddToQueue(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
            <li><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
            //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].length}</a></li>
            `+`<li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
            <ul class="more_option SongMO" style="visibility:hidden;">`;
                if (data[i].isInFavorites == 0)
                GenreSearch += `
                <li onclick="SearchAddSongToFavorites(${data[i].songID}, this)"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
                else if (data[i].isInFavorites == -1)
                GenreSearch += `<li onclick="LoginToFavorite()"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
                else GenreSearch += `<li onclick="SearchDeleteSongFromFavorites(${data[i].songID}, this)" SongID="${data[i].songID}"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite</a></li>`;
                GenreSearch += `<li onclick="AddToQueueSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
                <li onclick="DownloadSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
                <li onclick="ATP(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
                <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
            </ul>
        </li>`+
            //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].genreName}</a></li></ul>`;
                counter++;
        }
    }
    document.getElementById('SearchGenreContainer').innerHTML = GenreSearch;
    counter = 1;
    let ContainsQuery = `<ul class="album_list_name"><li>#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">Streams</li></ul>`;
    for (i in data) {
        if (data[i].isQueryInLyrics == 1) {
            ContainsQuery += `<ul>
            <li onclick='SearchAddToQueue(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
            <li><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
            //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].length}</a></li>
            <li class="text-center ms_more_icon"><a href="javascript:;" onclick="ToggleMore(this)"><span class="ms_icon1 ms_active_icon"></span></a>
            <ul class="more_option SongMO" style="visibility:hidden;">`;
            if (data[i].isInFavorites == 0)
            ContainsQuery += `
            <li onclick="SearchAddSongToFavorites(${data[i].songID}, this)"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
            else if (data[i].isInFavorites == -1)
            ContainsQuery += `<li onclick="LoginToFavorite()"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites</a></li>`;
            else ContainsQuery += `<li onclick="SearchDeleteSongFromFavorites(${data[i].songID}, this)" SongID="${data[i].songID}"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite</a></li>`;
            ContainsQuery += `<li onclick="AddToQueueSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add To Queue</a></li>
            <li onclick="DownloadSearch(${i})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download Now</a></li>
            <li onclick="ATP(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_playlst"></span></span>Add To Playlist</a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>Lyrics</a></li>
        </ul></li>`+
            //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].numOfPlays}</a></li></ul>`;
                counter++;
        }
    }
    document.getElementById('SearchLyricsContainer').innerHTML = ContainsQuery;
}
function SearchAddToQueue(i) {
    UnshiftToQueueAndPlay(SearchedResults[i]);
}
function AddToQueueSearch(i) {
    AddToQueue(SearchedResults[i]);
}
function PlayArtistFromSearch(PID) {
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}`;
    ajaxCall("GET", api, "", SearchPlayPerformerSongsSCB, ECB);
}
// Plays all of the songs of a specific artist, also saves them to the queue.
function SearchPlayPerformerSongsSCB(data) {
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
    PlayFirstInQueue();
}
function AddArtistToQueue(PID) {
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}`;
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
}
function DownloadSearch(i) {
    Download(SearchedResults[i].songID, SearchedResults[i].songName + " by " + SearchedResults[i].performerName + ".mp3");
}
function SearchAddSongToFavorites(SongID, elem) {
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
    ajaxCall("POST", api, "", SearchAddSongToFavoritesSCB, ECB);
  }
  function SearchAddSongToFavoritesSCB(data) {
    if (!data) openPopup("ERROR", "red", "This song is already in your favorites");
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
    // console.log(tmpElem)
    tmpElem.setAttribute('onclick', `SearchDeleteSongFromFavorites(${tmpElem.getAttribute('SongID')}, this)`);
  }
  function LoginToFavorite() {
    openPopup("ERROR", "red", "Log in to add songs to your favorites!");
  }
  function SearchDeleteSongFromFavorites(id, elem) {
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
    ajaxCall("DELETE", api, "", SearchDeleteSongFromFavoritesSCB, ECB);
  }
  function SearchDeleteSongFromFavoritesSCB(res) {
    // console.log(res);
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites`;
    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    tmpElem.setAttribute('onclick', `SearchAddSongToFavorites(${SongID}, this)`);
    //elem.setAttribute
  }
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