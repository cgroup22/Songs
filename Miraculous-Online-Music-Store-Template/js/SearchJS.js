function SearchLoaded() { // Get query and initiate search
    $("#RegisterForm").submit(Register); // submit register form
    $("#LoginForm").submit(Login); // submit login form
    SearchTryLogin(); // login
    // Saves whether we want our queue to loop
    IsLooped = false;
    // on escape, clear login and register forms
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
    CheckAudioPlayer(); // update queue
    // if no query, don't do anything, the user will leave the page on his own.
    if (sessionStorage['query'] == "" || sessionStorage['query'] == undefined) {
        //alert("Search something first");
        return;
    }
    // on new song play, update html
    $("#jquery_jplayer_1").bind($.jPlayer.event.play, function (event) {
        let tmpArr = [document.getElementById('SearchSongsContainer'), document.getElementById('SearchGenreContainer'), document.getElementById('SearchLyricsContainer')];
        let index = window.myPlaylist.current;
        for (tmp of tmpArr)
        for (i of tmp.children) {
            //console.log(i)
            if (!i.classList.contains('album_list_name')) {
                if (i.querySelector('.sNames').innerHTML === window.myPlaylist.playlist[index].title) {
                    i.classList.add('play_active_song');
                }
                else if (i.classList.contains('play_active_song'))
                    i.classList.remove('play_active_song');
            }
        }
      });
      // on change queue, update html and hide more options inside queue
    $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        HideMoreOptions();
      });
      // update html for query
    document.getElementById('ResultsTitle').innerHTML = `Results For "${sessionStorage['query']}"`;
    if (sessionStorage['query'].split(' ') > 1)
        document.getElementById('SongContains').innerHTML = `Songs That Contains The Words "${sessionStorage['query']}"`;
    else document.getElementById('SongContains').innerHTML = `Songs That Contains The Word "${sessionStorage['query']}"`;
    Search(sessionStorage['query']); // initiate search on db
}
// initiates search on db
function Search(query) {
    let UserID = -1;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        UserID = JSON.parse(localStorage["User"]).id;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        UserID = JSON.parse(sessionStorage["User"]).id;
    const api = `${apiStart}/Songs/Search/query/${query}/UserID/${UserID}`;
    ajaxCall("GET", api, "", SearchSCB, ECB);
}
// on sucess, update html according to search results.
function SearchSCB(data) {
    let query = sessionStorage['query'];
    // console.log(data);
    SearchedResults = data;
    // console.log(data);
    let counter = 1;
    // Update by song name
    let str = `<ul class="album_list_name"><li style="width:3%;">#</li><li>Song Title</li><li>Artist</li><li class="text-center" style="width:10%;">Duration</li><li class="text-center">More</li><li class="text-center">Streams</li><li class="text-center">Song Favorites</li></ul>`;
    for (i in data) {
        if (data[i].songName.toLowerCase().includes(query.toLowerCase())) {
            str += `<ul>
        <li onclick='SearchAddToQueue(${i})' style="width:3%;"><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
        <li onclick="MoveToArtist(${data[i].performerID})"><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
        //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
        `<li class="text-center" style="width:9%;"><a href="javascript:void(0)">${data[i].length}</a></li>
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
            <li onclick='OpenOnYT("${data[i].songName.replace(/'/g, "").replace('"', "")}", "${data[i].performerName.replace(/'/g, "").replace('"', "")}")'><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>YouTube</a></li>
        </ul>
    </li>`+
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        `<li class="text-center"><a href="javascript:void(0)">${data[i].numOfPlays}</a></li><li class="text-center"><a href="javascript:void(0)">${data[i].songFavorites}</a></ul>`;
            counter++;
        }
    }
    // Update by artist
    document.getElementById('SearchSongsContainer').innerHTML = str;
    counter = 1;
    let Artists = [];
    let ArtistsSTR = `<ul class="album_list_name"><li>#</li><li>Name</li><li class="text-center">Add To Queue</li><li class="text-center">Artist Favorites</li></ul>`;
    for (i in data) {
        if (data[i].performerName.toLowerCase().includes(query.toLowerCase()) && !Artists.includes(data[i].performerName.toLowerCase())) {
            Artists.unshift(data[i].performerName.toLowerCase());
            ArtistsSTR += `<ul>
            <li onclick='PlayArtistFromSearch(${data[i].performerID})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li onclick="MoveToArtist(${data[i].performerID})"><a href="javascript:void(0)">${data[i].performerName}</a></li><li style="text-align:center;" onclick="AddArtistToQueue(${data[i].performerID})"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>Add</a></li>
            <li class="text-center"><a href="javascript:void(0)">${data[i].artistFavorites}</a></ul>`;
            counter++;
        }
    }
    document.getElementById('SearchArtistsContainer').innerHTML = ArtistsSTR;
    counter = 1;
    // Update by genre
    let GenreSearch = `<ul class="album_list_name"><li style="width:3%;">#</li><li>Song Title</li><li>Artist</li><li class="text-center" style="width:10%;">Duration</li><li class="text-center">More</li><li class="text-center">Genre</li><li class="text-center">Song Favorites</li></ul>`;
    for (i in data) {
        if (data[i].genreName.toLowerCase().includes(query.toLowerCase())) {
            GenreSearch += `<ul>
            <li onclick='SearchAddToQueue(${i})' style="width:3%;"><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
            <li onclick="MoveToArtist(${data[i].performerID})"><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
            //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
            `<li class="text-center" style="width:9%;"><a href="javascript:void(0)">${data[i].length}</a></li>
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
                <li onclick='OpenOnYT("${data[i].songName.replace(/'/g, "").replace('"', "")}", "${data[i].performerName.replace(/'/g, "").replace('"', "")}")'><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>YouTube</a></li>
            </ul>
        </li>`+
            //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].genreName}</a></li><li class="text-center"><a href="javascript:void(0)">${data[i].songFavorites}</a></ul>`;
                counter++;
        }
    }
    // Update by songs lyrics
    document.getElementById('SearchGenreContainer').innerHTML = GenreSearch;
    counter = 1;
    let ContainsQuery = `<ul class="album_list_name"><li style="width:3%;">#</li><li>Song Title</li><li>Artist</li><li class="text-center" style="width:10%;">Duration</li><li class="text-center">More</li><li class="text-center">Streams</li><li class="text-center">Song Favorites</li></ul>`;
    for (i in data) {
        if (data[i].isQueryInLyrics == 1) {
            ContainsQuery += `<ul>
            <li onclick='SearchAddToQueue(${i})' style="width:3%;"><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
            <li onclick="getLyrics(${data[i].songID})"><a href="javascript:void(0)" class="sNames">${data[i].songName}</a></li>
            <li onclick="MoveToArtist(${data[i].performerID})"><a href="javascript:void(0)">${data[i].performerName}</a></li>` +
            //<li class="text-center"><a href="javascript:void(0)">Free</a></li>
            `<li class="text-center" style="width:9%;"><a href="javascript:void(0)">${data[i].length}</a></li>
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
            <li onclick='OpenOnYT("${data[i].songName.replace(/'/g, "").replace('"', "")}", "${data[i].performerName.replace(/'/g, "").replace('"', "")}")'><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>YouTube</a></li>
        </ul></li>`+
            //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
            `<li class="text-center"><a href="javascript:void(0)">${data[i].numOfPlays}</a></li>
            <li class="text-center"><a href="javascript:void(0)">${data[i].songFavorites}</a></li></ul>`;
                counter++;
        }
    }
    document.getElementById('SearchLyricsContainer').innerHTML = ContainsQuery;
}
// Play song (adds to queue as first and plays)
function SearchAddToQueue(i) {
    UnshiftToQueueAndPlay(SearchedResults[i]);
}
// Add to queue
function AddToQueueSearch(i) {
    AddToQueue(SearchedResults[i]);
}
// Plays artist songs
function PlayArtistFromSearch(PID) {
    let UserID = GetUserID();
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}/UserID/${UserID}`;
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
// Download song
function DownloadSearch(i) {
    Download(SearchedResults[i].songID, SearchedResults[i].songName + " by " + SearchedResults[i].performerName + ".mp3");
}
// Add song to favorites
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
  // on success, update html
  function SearchAddSongToFavoritesSCB(data) {
    if (!data) openPopup("ERROR", "red", "This song is already in your favorites");
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
    // console.log(tmpElem)
    tmpElem.setAttribute('onclick', `SearchDeleteSongFromFavorites(${tmpElem.getAttribute('SongID')}, this)`);
  }
  // delete song from favorites
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
  // on success, update html
  function SearchDeleteSongFromFavoritesSCB(res) {
    // console.log(res);
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites`;
    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    tmpElem.setAttribute('onclick', `SearchAddSongToFavorites(${SongID}, this)`);
    //elem.setAttribute
  }