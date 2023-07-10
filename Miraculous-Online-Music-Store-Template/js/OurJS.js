$(document).ready(function () {
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
    TryLogin();
    
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


      /*$("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        // Handle the song changing event here
        console.log("Song changed:", event.jPlayer.status.media);
      });*/

});
function TextDecod() {
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
}
function ECB(e) {
    console.log(e)
    //alert(e);
    openPopup("ERROR", "red", e);
}
function Register() {
    let password = document.getElementById("RegisterPassword").value;
    let confirmPassword = document.getElementById("RegisterConfirmPassword").value;
    if (password != confirmPassword) {
        alert("Passwords aren't matching!");
        return;
    }
    let email = document.getElementById("RegisterEmail").value;
    let name = document.getElementById("RegisterName").value;
    const api = `${apiStart}/Users`;
    let User = {
        email: email,
        name: name,
        password: password
    };
    ajaxCall("POST", api, JSON.stringify(User), RegisterSuccessCallback, RegisterErrorCallback);
    return false;
}
function RegisterSuccessCallback(data) {
    // TODO: change the alert
    // console.log(data)
    // alert(data.message);
    document.getElementById("RegisterErrorMSG").innerHTML = "";
}
function RegisterErrorCallback(error) {
    // TODO: change the alert
    console.log(error)
    // alert(error.responseJSON.message)
    document.getElementById("RegisterErrorMSG").innerHTML = error.responseJSON.message;
}
function Login() {
    let email = document.getElementById("LoginEmail").value;
    let password = document.getElementById("LoginPassword").value;
    if (email == "")
        alert("Please enter your email");
    if (password.length < 3)
        alert("Please enter your password");
    const api = `${apiStart}/Users/Login?email=${email}&password=${password}`;
    ajaxCall("POST", api, "", LoginSuccessCallback, LoginErrorCallback);
    return false;
}
function LoginSuccessCallback(data) {
    let KeepSignedIn = document.getElementById("KeepMeSignedInCheckBox").checked;
    if (KeepSignedIn)
        localStorage['User'] = JSON.stringify(data);
    else sessionStorage['User'] = JSON.stringify(data);
    /*document.getElementById("LoginErrorMSG").innerHTML = "";

    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="upload.html" class="ms_btn">upload</a>`
    + `<a href="javascript:;" class="ms_admin_name">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    `<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a href="#">Logout</a></li></ul>`;
    $('#myModal1').modal('hide');*/
    location.href = window.location.pathname.split('/').pop();
}
function LoginErrorCallback(error) {
    document.getElementById("LoginErrorMSG").innerHTML = error.responseJSON.message;
}
function RemoveErrorMesseages() {
    document.getElementById("RegisterErrorMSG").innerHTML = "";
    document.getElementById("LoginErrorMSG").innerHTML = "";
    document.getElementById("RegisterPassword").value = "";
    document.getElementById("RegisterConfirmPassword").value = "";
    document.getElementById("RegisterEmail").value = "";
    document.getElementById("RegisterName").value = "";
    document.getElementById("LoginEmail").value = "";
    document.getElementById("LoginPassword").value = "";
}
function TryLogin() {
    if (!IsLoggedIn()) return; // Returns if the user is not logged in
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    /*document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="upload.html" class="ms_btn">upload</a>`
    + `<a href="javascript:;" class="ms_admin_name">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    `<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a href="#">Logout</a></li></ul>`;*/
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    `<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
function TestGetSong() {
    var audio = new Audio();
    audio.src = `${apiStart}/Users/GetSong?name=Test.mp3`; // Replace 'songname' with the actual song name
    audio.type = 'audio/mpeg';
    audio.play();
}
// Gets the top 15 songs to feature (by number of plays)
function GetTop15() {
    const api = `${apiStart}/Songs/GetTop15`;
    ajaxCall("GET", api, "", UpdateTop15SCB, ECB);
}
// Updates top 15 songs (by # of plays)
function UpdateTop15SCB(data) {
    //console.log(data);
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
        x[i].querySelector('img').src = data[i].performerImage;
        names.querySelector('a').innerHTML = data[i].songName;
        names.querySelector('p').innerHTML = data[i].performerName;
    }
    //console.log(x[0]);
}
// Retrivies the song from the server, and autoplays to the user. Increases the number of plays of this song by 1.
function PlaySong(elem, SongID) {
    if (SongID < 1)
        return;
    if (document.getElementsByClassName('ms_active_play').length > 0)
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
    elem.parentNode.parentNode.querySelector('.w_tp_song_img').innerHTML += str;
    
    
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
}
function PlayArtist(PID) {
    // console.log(PID)
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${PID}`;
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
    PlayFirstInQueue();
}
// Plays the first song in the queue. Removes unnecessary html elements.
function PlayFirstInQueue() {
    let del = document.getElementById('deldel');
    if (del)
        del.parentNode.removeChild(del);
    if (document.getElementsByClassName('ms_active_play').length > 0)
    document.getElementsByClassName('ms_active_play')[0].classList.remove('ms_active_play');
    for (i of document.getElementsByClassName('ms_play_icon'))
        i.style.visibility = 'visible';
    //console.log(window.myPlaylist.playlist);
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
                    PlayFirstInQueue();
                    break;
                }
            }
        } else {
            window.myPlaylist.playlist.unshift(song);
            window.myPlaylist.original.unshift(song);
            window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
            localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
            PlayFirstInQueue();
        }
    };
    // If user chose to add the song to the queue
    // add the song but don't play immediately
    // if the song is already in the queue, return.
    document.getElementById('MostPlayedPAddToQueue').onclick = () => {
        if (!IsSongInQueueByNameAndArtist(song.artist, song.title)) return;
        window.myPlaylist.playlist.push(song);
        window.myPlaylist.original.push(song);
        window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
        localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    };
    document.getElementById('MostPlayedPGetLyrics').onclick = () => {
        getLyrics(data.songID);
    };
}
// returns true if the song is already in the queue.
function IsSongInQueueByNameAndArtist(artist, title) {
    if (!window.myPlaylist.playlist) return false;
    for (i of window.myPlaylist.playlist)
        if (i.title === title && i.artist === artist)
            return true;
    return false;
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
  // Plays live radio station. RadioStations array is defined in RadioStations.js
  function PlayRadio(id) {
    if (id > RadioStations.length || id < 0) return;
    //console.log(RadioStations);
    window.myPlaylist.playlist.unshift(RadioStations[id]);
    window.myPlaylist.original.unshift(RadioStations[id]);
    window.myPlaylist.setPlaylist(window.myPlaylist.playlist);
    //localStorage['Queue'] = JSON.stringify(window.myPlaylist.playlist);
    PlayFirstInQueue();
  }
  function HideAudioPlayer() {
    document.getElementsByClassName('ms_player_wrapper')[0].style.visibility = 'hidden';
  }
  function ShowAudioPlayer() {
    document.getElementsByClassName('ms_player_wrapper')[0].style.visibility = 'visible';
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
  function getLyrics(SongID) {
    const api = `${apiStart}/Songs/GetSongLyrics/SongID/${SongID}`;
    ajaxCall("GET", api, "", getLyricsSCB, (e) => { openPopup("ERROR", "red", "Couldn't retrieve song lyrics"); console.log(e); });
  }
  function getLyricsSCB(data) {
    // console.log(data.lyrics);
    openPopup(data.SongName, "white", data.Lyrics.replace(/\r\n/g, '<br>').replace(/\n/g, '<br>'));
  }