// Called when the favorites page is loaded
function ArtLoaded() {
    if (sessionStorage['Artist'] == undefined || sessionStorage['Artist'] == "") { // If no artist was chosen, go back to homepage.
        openPopup("ERROR", 'red', 'Choose artist first!');
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        return;
    }
    // Saves whether we want our queue to loop
    IsLooped = false;
    // Get chosen artist
    Artist = JSON.parse(sessionStorage['Artist']);
    // Takes care of login and register forms
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
    TryLoginFromArtist(); // Logs in
    UpdateArtist(); // Updates artist info
    CheckAudioPlayer(); // Updates queue
    GetTotalPlaysOfArtist(); // Gets total plays of artists
    GetTotalFavoritesOfArtist(); // Gets total favorites of artists (by his/her songs)
    GetTotalFollowersOfArtist(); // Get total followers of artists
    GetArtistsComments(); // Get artists comments
    GetArtistInstagramHandle(); // Get instagram handle to show instagram page.
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
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) { // Hide more options on queue, onchange.
        HideMoreOptions();
      });
}
// Gets instagram user. on error, user won't see the instagram page.
function GetArtistInstagramHandle() {
  const api = `${apiStart}/Performers/GetPerformerInstagram/PerformerID/${Artist.id}`;
  ajaxCall("GET", api, "", GetArtistInstagramHandleSCB, (e) => {console.log(e);});
}
// updates artists instagram page
function GetArtistInstagramHandleSCB(d) {
  // console.log(d);
  if (d.instagram == "null") return;
  document.getElementById('ArtistsInstagram').style.display = 'block';
  document.getElementById('ArtistsInstagram').src = `https://www.instagram.com/${d.instagram}/embed`;
}
// Gets artists info from last fm (summary)
function GetArtistInfoFromLastFM(queryArtistName) {
    const apiKey = 'cdd5f93673066c226a1250d12317c85d';
const artistName = queryArtistName;

const apiUrl = `https://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist=${encodeURIComponent(
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
// Logs in and updates html elems
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
// Gets artists info
function UpdateArtist() {
    let UserID = GetUserID();
    const api = `${apiStart}/Songs/GetPerformerSongs/PerformerID/${Artist.id}/UserID/${UserID}`;
    ajaxCall("GET", api, "", UpdateArtistSCB, ECB);
}
// Updates artist info on html page dynamically (songs, name, image, etc..)
function UpdateArtistSCB(data) {
  // console.log(data)
    if (data.length == 0) return;
    GetConcerts(data[0].performerName);
    document.title = `${data[0].performerName}'s Information`;
    GetArtistInfoFromLastFM(data[0].performerName);
    document.getElementById('ArtistName').innerHTML = data[0].performerName;
    document.getElementById('TopArtistPage').querySelector('img').src = data[0].performerImage;
    document.getElementById('ArtistImage').style.display = 'block';
    if (data[0].isUserFollowingArtist == -1) {
      $("#CommentForm").submit(LoginToPostComment);
      document.getElementById('CommentBTN').setAttribute('onclick', 'LoginToPostComment()');
      document.getElementById('FollowBTN').setAttribute('onclick', 'LoginToFollowArtist()');
      document.getElementById('FollowText').innerHTML = "Follow";
    } else if (data[0].isUserFollowingArtist == 1) {
      $("#CommentForm").submit(PostComment);
      document.getElementById('CommentBTN').setAttribute('onclick', 'PostComment()');
      document.getElementById('FollowText').innerHTML = "Unfollow";
      document.getElementById('FollowBTN').setAttribute('onclick', 'UnfollowArtist()');
    } else {
      $("#CommentForm").submit(FollowToPostComment);
      document.getElementById('CommentBTN').setAttribute('onclick', 'FollowToPostComment()');
      document.getElementById('FollowText').innerHTML = "Follow";
      document.getElementById('FollowBTN').setAttribute('onclick', 'FollowArtist()');
    }
    // console.log(data);
    ArtistSongs = data;
    UpdateArtistSongs();
    document.getElementById('PlaySongsBTN').setAttribute('onclick', `PlayArtistSongsWithoutShuffle(${Artist.id})`);
    document.getElementById('AddSongsToQueueBTN').setAttribute('onclick', `AddArtistToQueue(${Artist.id})`);
}
// Shows popup to login to post anything.
function LoginToPostComment() {
  openPopup('ERROR', "red", "Login to post a comment!");
  return false;
}
// Shows popup - needs to follow artist to comment.
function FollowToPostComment() {
  openPopup('ERROR', "red", "Only followers can post a comment!");
  return false;
}
// Follow artist.
function FollowArtist() {
  let UserID = GetUserID();
  if (UserID == undefined || UserID < 1) return;
  const api = `${apiStart}/Users/FollowArtist/UserID/${UserID}/PerformerID/${Artist.id}`;
  ajaxCall("POST", api, "", FollowArtistSCB, ECB);
}
// On sucess, update html elems and allow to comment
function FollowArtistSCB() {
  document.getElementById('FollowText').innerHTML = "Unfollow";
  document.getElementById('FollowBTN').setAttribute('onclick', 'UnfollowArtist()');
  $("#CommentForm").off("submit");
  if (!IsLoggedIn()) {
    document.getElementById('CommentBTN').setAttribute('onclick', 'LoginToPostComment()');
    $("#CommentForm").submit(LoginToPostComment);
  }
  else {
    $("#CommentForm").submit(PostComment);
    document.getElementById('CommentBTN').setAttribute('onclick', 'PostComment()');
  }
  if (document.getElementById('TotalFollowers').style.display !== "none")
    document.getElementById('TotalFollowers').innerHTML = `Followers: ${parseInt(document.getElementById('TotalFollowers').innerHTML.split(' ')[1]) + 1}`;
}
// Post comment on artist
function PostComment() {
  if (document.getElementById('CommentInput').value == "" || document.getElementById('CommentInput').value == undefined) return;
  let UserID = GetUserID();
  if (UserID == undefined || UserID < 1) return;
  const api = `${apiStart}/Comments`;
  let UserName = (sessionStorage['User'] == undefined || sessionStorage['User'] == "") ? JSON.parse(localStorage['User']).name : JSON.parse(sessionStorage['User']).name;
 // console.log(dateString)
  CommentToPost = {
    "commentID": 0,
    "userID": UserID,
    "performerID": Artist.id,
    "content": document.getElementById('CommentInput').value,
    "userName": UserName
  };
  ajaxCall("POST", api, JSON.stringify(CommentToPost), PostCommentSCB, ECB);
  return false;
}
// Get artists commments
function GetArtistsComments() {
  const api = `${apiStart}/Comments/GetArtistsComments/PerformerID/${Artist.id}`;
  ajaxCall("GET", api, "", GetArtistsCommentsSCB, ECB);
}
// Updates artist comments dynamically
function GetArtistsCommentsSCB(data) {
  NumberOfComments = data.length;
  if (data.length == 0) {
    document.getElementById('CommentSection').innerHTML = 'No comments yet.. be the first to comment!';
    document.getElementById('CommentSection').style.color = 'white';
    document.getElementById('CommentSection').style.textAlign = 'center';
    document.getElementById('CommentSection').style.fontSize = '20px';
    return;
  }
  document.getElementById('CommentsTitle').innerHTML = `${NumberOfComments} Comments`;
  let str = ``, img = ``;
  let randomInt;
  // console.log(data);
  for (i in data) {
    randomInt = Math.floor(Math.random() * 3);
    switch (randomInt) {
      case 0:
        img = `https://bootdey.com/img/Content/user_1.jpg`;
        break;
      case 1:
        img = `https://bootdey.com/img/Content/user_2.jpg`;
        break;
      default:
        img = `https://bootdey.com/img/Content/user_3.jpg`;
        break;
    }
    str += `<li class="clearfix">
    <img src="${img}" class="avatar" alt="">
    <div class="post-comments">
        <p class="meta">${data[i].date.substring(0, data[i].date.indexOf('T'))}<a style="color:#3bc8e7;"> ${data[i].userName}</a> says:
        <p>
        ${data[i].content}
        </p>
    </div>
  </li>`;
  }
  document.getElementById('CommentSection').innerHTML = str;
}
// Post comments and updates html
function PostCommentSCB() {
  document.getElementById('CommentInput').value = "";
  let randomInt = Math.floor(Math.random() * 3);
  let date = new Date();
  let dateString = `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1}-${date.getDate() < 10 ? "0" + date.getDate() : date.getDate()}`;
    switch (randomInt) {
      case 0:
        img = `https://bootdey.com/img/Content/user_1.jpg`;
        break;
      case 1:
        img = `https://bootdey.com/img/Content/user_2.jpg`;
        break;
      default:
        img = `https://bootdey.com/img/Content/user_3.jpg`;
        break;
    }
    let UserName = (sessionStorage['User'] == undefined || sessionStorage['User'] == "") ? JSON.parse(localStorage['User']).name : JSON.parse(sessionStorage['User']).name;
    let str = `<li class="clearfix">
    <img src="${img}" class="avatar" alt="">
    <div class="post-comments">
        <p class="meta" style="text-align:left;">${dateString}<a style="color:#3bc8e7;"> ${UserName}</a> says:
        <p style="text-align:left;">
        ${CommentToPost.content}
        </p>
    </div>
  </li>`;
  if (NumberOfComments === 0)
    document.getElementById('CommentSection').innerHTML = str;
    else document.getElementById('CommentSection').innerHTML += str;
    NumberOfComments++;
}
// Unfollow artist (PUT to db)
function UnfollowArtist() {
  let UserID = GetUserID();
  if (UserID == undefined || UserID < 1) return;
  const api = `${apiStart}/Users/UnfollowArtist/UserID/${UserID}/PerformerID/${Artist.id}`;
  ajaxCall("DELETE", api, "", UnfollowArtistSCB, ECB);
}
// On sucess of unfollow, update html and forbid to post any comments.
function UnfollowArtistSCB() {
  document.getElementById('FollowText').innerHTML = "Follow";
  document.getElementById('FollowBTN').setAttribute('onclick', 'FollowArtist()');
  $("#CommentForm").off("submit");
  if (!IsLoggedIn()) {
    document.getElementById('CommentBTN').setAttribute('onclick', 'LoginToPostComment()');
    $("#CommentForm").submit(LoginToPostComment);
  }
  else {
    document.getElementById('CommentBTN').setAttribute('onclick', 'FollowToPostComment()');
    $("#CommentForm").submit(FollowToPostComment);
  }
  if (document.getElementById('TotalFollowers').style.display !== "none")
    document.getElementById('TotalFollowers').innerHTML = `Followers: ${parseInt(document.getElementById('TotalFollowers').innerHTML.split(' ')[1]) - 1}`;
}
// Shows popup to login in order to follow artist.
function LoginToFollowArtist() {
  openPopup('ERROR', 'red', 'Login to follow the artist!');
}
// Updates artist songs dynamically on html page.
function UpdateArtistSongs() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li style="width: 3%;">#</li><li>Song Title</li><li>Artist</li><li class="text-center">Duration</li><li class="text-center">More</li><li class="text-center">Favorite</li><li class="text-center" style="">Song User Favorites</li></ul>`;
    for (i in ArtistSongs) {
    str += `<ul>
        <li style="width: 3%;" onclick='ArtistPlaySong(${i})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
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
                <li onclick="OpenOnYT('${ArtistSongs[i].songName.replace(/'/g, "").replace('"', "")}', '${ArtistSongs[i].performerName.replace(/'/g, "").replace('"', "")}')"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_share"></span></span>YouTube</a></li>
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
            str += `<li class="text-center" ><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_queue"></span></span>${ArtistSongs[i].songTotalFavorites}</a></li>`
    str += `</ul>`;
        counter++;
    }
    if (ArtistSongs.length == 0) {
        str += `<p id="NoFavSongs">None<p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
// Updates queue if there's any song. Otherwise, hide audio player.
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
// Removes a song from favorites
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
// on sucess, remove from corresponding array and update html
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
// Play song
function ArtistPlaySong(id) {
    UnshiftToQueueAndPlay(ArtistSongs[id]);
}
// add song to queue
function AddToQueueFav(i) {
    AddToQueue(ArtistSongs[i]);
}
// downloads
function DownloadFromArtist(i) {
    Download(ArtistSongs[i].songID, ArtistSongs[i].songName + " by " + ArtistSongs[i].performerName + ".mp3");
}
// add artist's song to favorites
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
  // on sucess, update html
  function ArtistAddSongToFavoritesSCB(data) {
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Unfavorite`;
    // console.log(tmpElem)
    tmpElem.setAttribute('onclick', `ArtistDeleteSongFromFavorites(${tmpElem.getAttribute('SongID')}, this)`);
  }
  // delete artist's song from favorites
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
  // on sucess, update html.
  function ArtistDeleteSongFromFavoritesSCB(res) {
    // console.log(res);
    tmpElem.querySelector('a').innerHTML = `<span class="opt_icon"><span class="icon icon_fav"></span></span>Add To Favourites`;
    let SongID = parseInt(tmpElem.getAttribute('SongID'));
    tmpElem.setAttribute('onclick', `ArtistAddSongToFavorites(${SongID}, this)`);
    //elem.setAttribute
  }
  // Get total plays of artist (across all songs)
  function GetTotalPlaysOfArtist() {
    const api = `${apiStart}/Performers/GetTotalStreamsOfPerformer/PerformerID/${Artist.id}`;
    ajaxCall("GET", api, "", GetTotalPlaysOfArtistSCB, (err) => { console.log(err); });
  }
  // on sucess, update on page
  function GetTotalPlaysOfArtistSCB(data) {
    document.getElementById('TotalStreams').innerHTML = `Total Plays: ${data.totalPlays}`;
    document.getElementById('TotalStreams').style.display = `block`;
  }
  // Get total artists favorites
  function GetTotalFollowersOfArtist() {
    const api = `${apiStart}/Performers/GetTotalFollowersOfPerformer/PerformerID/${Artist.id}`;
    ajaxCall("GET", api, "", GetTotalFollowersOfArtistSCB, (err) => { console.log(err); });
  }
  // on sucess getting followers, update on page
  function GetTotalFollowersOfArtistSCB(data) {
    document.getElementById('TotalFollowers').innerHTML = `Followers: ${data.totalFollowers}`;
    document.getElementById('TotalFollowers').style.display = `block`;
  }
// Gets total song favorites of this artist.
  function GetTotalFavoritesOfArtist() {
    const api = `${apiStart}/Performers/GetTotalFavoritesOfPerformer/PerformerID/${Artist.id}`;
    ajaxCall("GET", api, "", GetTotalFavoritesOfArtistSCB, (err) => { console.log(err); });
  }
  // Updates html data.
  function GetTotalFavoritesOfArtistSCB(data) {
    document.getElementById('TotalFavorites').innerHTML = `Total ${document.getElementById('ArtistName').innerHTML}'s User Favorites: ${data.totalFavorites}`;
    document.getElementById('TotalFavorites').style.display = `block`;
  }
// Get all artists concerts from TicketMaster API.
  function GetConcerts(artistName) {
    $.ajax({
        type:"GET",
        url:`https://app.ticketmaster.com/discovery/v2/events.json?keyword=${artistName}&apikey=sGS4leVOIAuCcazajk6HxuSuvPhcaoCu`,
        async:true,
        dataType: "json",
        success: function(json) {
                    // console.log(json);
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
                            <li class="text-center"><a href="javascript:void(0)">${i.classifications[0].genre.name}</a></li>
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