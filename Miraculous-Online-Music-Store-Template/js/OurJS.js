$(document).ready(function () {
    window.myPlayListOtion = "";
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
    TryLogin();
    // Saves whether we want our queue to loop
    IsLooped = false;
    // מוחק את המידע מטופס ההרשמה והלוגין אם לחצו אסקייפ לסגירתו
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

      $("#jquery_jplayer_1").bind($.jPlayer.event.play, function (event) {
        // Handle the song started playing event here
        // console.log("Song started playing:", event.jPlayer.status.media);
                    if (document.getElementsByClassName('ms_active_play').length > 0)
                        document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
                        let str = `<div class="ms_play_icon" id="deldel"><div class="ms_bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>`;
                        let del = document.getElementById('deldel');
                        if (del)
                            del.parentNode.removeChild(del);
                    for (i of document.getElementsByClassName('ms_play_icon'))
                        i.style.visibility='visible';
        if (Top15) {
            for (i in Top15) {
                if (i == "15")
                    break;
                if (Top15[i].songName == event.jPlayer.status.media.title && Top15[i].performerName == event.jPlayer.status.media.artist) {
                    let elem = document.getElementsByClassName('ms_weekly_box')[i];
                    if (elem != undefined) {
                        elem.querySelector('.ms_play_icon').style.visibility='hidden';
                        elem.classList.add('ms_active_play');
                        elem.querySelector('.w_tp_song_img').innerHTML += str;
                    }
                    break;
                }
            }
        }
      });
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        // Handle the song changing event here
        // console.log("Song changed:", event.jPlayer.status.media);
        HideMoreOptions();
      });

});
/*function TextDecod() {
    //const api = `https://api.deezer.com/search?q={7%20Rings}&secret_key=${DeezerSecretKey}`;
    const api = `${apiStart}/Users`;
    //console.log(api)
    ajaxCall("GET", api, "", TestCB, ECB);
}
function TestCB(data) {
    //console.log(data);
    //console.log(data.data[0].preview)
    var audio = new Audio(data.data[0].preview);
    audio.play();
}*/
function TestGetSong() {
    var audio = new Audio();
    audio.src = `${apiStart}/Users/GetSong?name=Test.mp3`; // Replace 'songname' with the actual song name
    audio.type = 'audio/mpeg';
    audio.play();
}
// Gets the top 15 songs to feature (by number of plays)
function GetTop15() {
    var api = `${apiStart}/Songs/GetTop15`;
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        api = `${apiStart}/Songs/GetTop15?UserID=${JSON.parse(localStorage["User"]).id}`;
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        api = `${apiStart}/Songs/GetTop15?UserID=${JSON.parse(sessionStorage["User"]).id}`;
    ajaxCall("GET", api, "", UpdateTop15SCB, ECB);
}
// Updates top 15 songs (by # of plays)
function UpdateTop15SCB(data) {
    Top15 = data;
    // console.log(data);
    let x = document.getElementsByClassName('ms_weekly_box');
    for (i in x) {
        if (x[i] == "15")
            break;
        let names = x[i].getElementsByClassName("w_tp_song_name")[0];
        x[i].querySelector('.w_song_time').innerHTML = data[i].songLength;
        let SongPlay = x[i].querySelector('.w_tp_song_img');
        if (SongPlay != null)
            SongPlay.setAttribute("onclick", `PlaySong(this, ${data[i].songID})`);
        document.getElementById(`LyricsFeatured${i}`).setAttribute('onclick', `getLyrics(${data[i].songID})`);
        document.getElementById(`FavoriteFeat${i}`).setAttribute('SongID', data[i].songID);
        if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "") {
            if (data[i].isInFav == 0)
                document.getElementById(`FavoriteFeat${i}`).setAttribute('onclick', `AddSongToFavorites(${data[i].songID}, ${JSON.parse(localStorage["User"]).id}, this)`);
            else {
                document.getElementById(`FavoriteFeat${i}`).setAttribute('onclick', `DeleteSongFromFavorites(${data[i].songID}, ${JSON.parse(localStorage["User"]).id}, this)`);
                document.getElementById(`FavoriteFeat${i}`).querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
            }
        }
        else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "") {
            if (data[i].isInFav == 0)
                document.getElementById(`FavoriteFeat${i}`).setAttribute('onclick', `AddSongToFavorites(${data[i].songID}, ${JSON.parse(sessionStorage["User"]).id}, this)`);
            else  {
                document.getElementById(`FavoriteFeat${i}`).setAttribute('onclick', `DeleteSongFromFavorites(${data[i].songID}, ${JSON.parse(sessionStorage["User"]).id}, this)`);
                document.getElementById(`FavoriteFeat${i}`).querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
            }
        }
        else
            document.getElementById(`FavoriteFeat${i}`).onclick = () => { openPopup("ERROR", "red", "Log in to add songs to your favorites!") };
        document.getElementById(`DownloadFeat${i}`).setAttribute('onclick', `Download(${data[i].songID}, "${data[i].songName} by ${data[i].performerName}.mp3")`);
        document.getElementById(`AddToQFeat${i}`).setAttribute('onclick', `AddToQueue(${JSON.stringify(data[i])})`);
        document.getElementById(`AddToPlaylistFeat${i}`).setAttribute('onclick', `ATP(${data[i].songID})`);
        x[i].querySelector('img').src = data[i].performerImage;
        names.querySelector('a').innerHTML = data[i].songName;
        names.querySelector('a').setAttribute(`onclick`, `getLyrics(${data[i].songID})`);
        names.querySelector('p').innerHTML = data[i].performerName;
        names.querySelector('p').setAttribute('onclick', `MoveToArtist(${data[i].performerID})`);
    }
    //console.log(x[0]);
}
// Retrivies the song from the server, and autoplays to the user. Increases the number of plays of this song by 1.
function PlaySong(elem, SongID) {
    if (SongID < 1)
        return;
    /*if (document.getElementsByClassName('ms_active_play').length > 0)
        document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility='visible';
    elem.parentNode.parentNode.querySelector('.ms_play_icon').style.visibility='hidden';
    elem.parentNode.parentNode.parentNode.classList.add('ms_active_play');
    //console.log( elem.parentNode.parentNode)
    let str = `<div class="ms_play_icon" id="deldel"><div class="ms_bars"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div></div>`;
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    elem.parentNode.parentNode.querySelector('.w_tp_song_img').innerHTML += str;*/
    
    
    // We need promise because we'd like to play the song instantly when it loads, and we need to give the server time to return the mp3 file.
    let song = {
        image: elem.querySelector('img').src,	
        title: elem.parentNode.querySelector('a').innerHTML,
        artist: elem.parentNode.querySelector('p').innerHTML,
        mp3: `${apiStart}/Songs/GetSongByID/SongID/${SongID}`,
        oga: `${apiStart}/Songs/GetSongByID/SongID/${SongID}`,
		option : window.myPlayListOtion
    };
    window.addEventListener('load', function() {
        window.requestAnimationFrame(playSong);
    });
    function updatePlaylist() {
        return new Promise(function(resolve, reject) {
            //console.log(window.myPlaylist.playlist)
            for(i in window.myPlaylist.playlist)
                if (window.myPlaylist.playlist[i].title == song.title)
                    window.myPlaylist.playlist.splice(i, 1);
            window.myPlaylist.playlist.unshift(song);
            window.myPlaylist.original.unshift(song);
            window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
            resolve();
        });
    }
    function playSong() {
        return new Promise(function(resolve, reject) {
            $(document).on($.jPlayer.event.canplay, function() {
                $("#jquery_jplayer_1").jPlayer("play");
                ShowAudioPlayer();
                resolve();
            });
        });
    }
    updatePlaylist()
        .then(playSong)
        .then(function() {
            localStorage["Queue"] = JSON.stringify(window.myPlaylist.playlist);
        })
        .catch(function(error) {
            console.error("Error occurred:", error);
        });
}
function GetFeaturedArtists() {
    const api = `${apiStart}/Artists/GetFeaturedArtists`;
    ajaxCall("GET", api, "", UpdateFeaturedArtists, ECB);
}
// Updates featured artists section (by # of listeners)
function UpdateFeaturedArtists(data) {
    //console.log(data);
    let x = document.getElementsByClassName('FeaturedArtistsSlide');
    for (i in data) {
        //console.log(`Artist${i}Image`)
        //console.log(document.getElementById(`Artist${i}Image`))
        let images = document.getElementsByClassName(`Artist${i}Image`);
        let names = document.getElementsByClassName(`Artist${i}Name`);
        let playBtns = document.getElementsByClassName(`Artist${i}Play`);
        for (j of playBtns)
        {
            j.id = data[i].performerID;
            j.setAttribute('onclick', `PlayArtist(${data[i].performerID})`); 
        }
        for (j of names) {
            j.innerHTML = data[i].performerName;
        }
        for (j of images) {
            j.src = data[i].performerImage;
            j.style.width = "281px";
            j.style.height = "281px";
        }
    }
    for (i of document.getElementsByClassName('FeaturedArtistsMore'))
        i.style.display = 'none';
}
// Called to dynamically load the index page.
function IndexLoaded() {
    // Get top 15 songs and update the html dynamically
    GetTop15();
    // Get featured artists and update the html dynamically
    GetFeaturedArtists();
    let Q = localStorage['Queue'];
    //console.log(Q)
    let RPlayed = document.getElementById('RPlayed');
    if (Q == "" || Q == undefined) {
        //window.myPlaylist.playlist=[];
        //RPlayed.style.display = 'none';
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
        // Used to update recently played. Not sure this is needed
        /*console.log(tmp);
        console.log(tmp.length);
        if (typeof tmp === "object" && tmp.length > 5) { // if the Q has atleast 6 songs to fill the recently played div
            for (i in tmp) { // update Recently Played songs
                console.log(i)
                if (parseInt(i) >= 6)
                    break;
                let img = document.getElementById(`RPlayed${i}Image`);
                img.src = tmp[i].image;
                img.style.width = "251px";
                img.style.height = "251px";
                document.getElementById(`RPlayed${i}PerformerName`).innerHTML = tmp[i].artist;
                document.getElementById(`RPlayed${i}SongName`).innerHTML = tmp[i].title;
            }
        }
        else {
            RPlayed.style.display = 'hidden';
            // REMOVE R
        }*/
        //if (document.getElementsByClassName('que_data').length > 0)
        //    document.getElementsByClassName('que_data')[0].innerHTML = `${Q[0].title}<div class="jp-artist-name">${Q[0].artist}</div>`;
    }
    // For now, disable recently played.
    RPlayed.style.display = 'none';

    // Gets the most played track and updates the home page html dynamically
    GetMostPlayedTrack();
}
// Check
function ClearQueue() {
    localStorage['Queue'] = "";
    window.myPlaylist.playlist=[];
    window.myPlaylist.original=[];
    window.myPlaylist.setPlaylist([]);
    $("#jquery_jplayer_1").jPlayer("pause");
    for (i of document.getElementsByClassName('ms_active_play'))
        i.classList.remove('ms_active_play');
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility='visible';
    HideAudioPlayer();
}
function GetMostPlayedTrack() {
    const api = `${apiStart}/Songs/GetMostPlayedTrack`;
    ajaxCall("GET", api, "", GetMostPlayedTrackSCB, ECB);
}
// Gets the most played song, and updates the html dynamically
function GetMostPlayedTrackSCB(data) {
    //console.log(data);
    document.getElementById('MostPlayedP').innerHTML = `${data.songName} by ${data.performerName}<br>${data.numOfPlays} Listeners<br>${data.songLength}`;
    // If the user clicked play now, unshift into the queue and play the song.
    let song = {
        image: data.performerImage,	
        title: data.songName,
        artist: data.performerName,
        mp3: `${apiStart}/Songs/GetSongByID/SongID/${data.songID}`,
        oga: `${apiStart}/Songs/GetSongByID/SongID/${data.songID}`,
        option : window.myPlayListOtion
    };
    document.getElementById('MostPlayedPListenNow').onclick = () => {
        if (IsSongInQueueByNameAndArtist(song.artist, song.title)) {
            for (i in window.myPlaylist.playlist) {
                if (window.myPlaylist.playlist[i].title === song.title) {
                    let tmp = window.myPlaylist.playlist[i];
                    window.myPlaylist.playlist[i] = window.myPlaylist.playlist[0];
                    window.myPlaylist.playlist[0] = tmp;
                    window.myPlaylist.original = window.myPlaylist.playlist;
                    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
                    localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
                    HandleIndexPlayFirstInQueue();
                    PlayFirstInQueue();
                    break;
                }
            }
        } else {
            window.myPlaylist.playlist.unshift(song);
            window.myPlaylist.original.unshift(song);
            window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
            localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
            HandleIndexPlayFirstInQueue();
            PlayFirstInQueue();
        }
    };
    // If user chose to add the song to the queue
    // add the song but don't play immediately
    // if the song is already in the queue, return.
    document.getElementById('MostPlayedPAddToQueue').onclick = () => {
        if (IsSongInQueueByNameAndArtist(song.artist, song.title)) return;
        window.myPlaylist.playlist.push(song);
        window.myPlaylist.original.push(song);
        window.myPlaylist.autoplay = false;
        window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
        window.myPlaylist.autoplay = false;
        //window.myPlaylist.autoplay = true;
        localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    };
    document.getElementById('MostPlayedPGetLyrics').onclick = () => {
        getLyrics(data.songID);
    };
}
function PlayGenre(GenreID) {
    const api = `${apiStart}/Songs/GetGenreSongs/GenreID/${GenreID}`;
    // Used PlayPerformerSongsSCB here because it's updating the queue and plays the first song.
    ajaxCall("GET", api, "", PlayGenreSCB, ECB);
}
function PlayGenreSCB(data) {
    // Randomize the songs - done in PlayPerformerSongsSCB, just a test here.
    // shuffle(data);
    // Updates the queue and plays the first song
    PlayPerformerSongsSCB(data);
}
  // Plays live radio station. RadioStations array is defined in RadioStations.js
  function PlayRadio(id) {
    if (id > RadioStations.length || id < 0) return;
    //console.log(RadioStations);
    window.myPlaylist.playlist.unshift(RadioStations[id]);
    window.myPlaylist.original.unshift(RadioStations[id]);
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    //localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    HandleIndexPlayFirstInQueue();
    PlayFirstInQueue();
  }
  function AddSongToFavorites(SongID, UserID, elem) {
    if (!IsLoggedIn()) {
        openPopup("ERROR", "red", "You're not logged in!");
        return;
    }
    tmpElem = elem;
    const api = `${apiStart}/Users/PostUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("POST", api, "", AddSongToFavoritesSCB, ECB);
  }
  function DeleteSongFromFavorites(SongID, UserID, elem) {
    tmpElem = elem;
    const api = `${apiStart}/Users/DeleteUserFavorite/UserID/${UserID}/SongID/${SongID}`;
    ajaxCall("DELETE", api, "", DeleteSongFromFavoritesSCB, ECB);
  }
  function AddSongToFavoritesSCB(data) {
    if (!data) openPopup("ERROR", "red", "This song is already in your favorites");
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;

    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        tmpElem.setAttribute('onclick', `DeleteSongFromFavorites(${SongID}, ${JSON.parse(localStorage["User"]).id}, this)`);
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        tmpElem.setAttribute('onclick', `DeleteSongFromFavorites(${SongID}, ${JSON.parse(sessionStorage["User"]).id}, this)`);
    else
        tmpElem.onclick = () => { openPopup("ERROR", "red", "Log in to add songs to your favorites!") };
    //tmpElem.setAttribute('onclick', 'DeleteSongFromFavoritesSCB()');
    // console.log(data);
    // TODO: Add message?
  }
  function DeleteSongFromFavoritesSCB(data) {
    /*console.log("bye");
    if(!data) return;
    console.log("hi");*/
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites`;

    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    if (IsLoggedIn() && localStorage["User"] != null && localStorage["User"] != "")
        tmpElem.setAttribute('onclick', `AddSongToFavorites(${SongID}, ${JSON.parse(localStorage["User"]).id}, this)`);
    else if (IsLoggedIn() && sessionStorage["User"] != null && sessionStorage["User"] != "")
        tmpElem.setAttribute('onclick', `AddSongToFavorites(${SongID}, ${JSON.parse(sessionStorage["User"]).id}, this)`);
    else
    tmpElem.onclick = () => { openPopup("ERROR", "red", "Log in to add songs to your favorites!") };
  }
  function RemoveCurrentPlayingSongElements() {
    if (document.getElementsByClassName('ms_active_play').length > 0)
        document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility='visible';
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
  }
  function HandleIndexPlayFirstInQueue() {
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    if (document.getElementsByClassName('ms_active_play').length > 0)
    document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility = 'visible';
  }
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