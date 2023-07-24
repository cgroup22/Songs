// Called when the favorites page is loaded
function FollowingListLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    FavoriteTryLogin(); // logs in if there's anything in the storage, moves to index.html if the user is not logged in
    UpdateFollowing(); // ajax to get user following list.
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
// ajax call to get users following.
function UpdateFollowing() {
    if (!IsLoggedIn()) return;
    let userID = -1;
    if (localStorage['User'] == undefined || localStorage['User'] == "")
        userID = JSON.parse(sessionStorage['User']).id;
    else userID = JSON.parse(localStorage['User']).id;
    if (userID < 1) return;
    const api = `${apiStart}/Users/GetUserFollowingList/UserID/${userID}`;
    ajaxCall("GET", api, "", GetUserFollowingSCB, ECB);
}
// Gets user following list sucess callback and updates html elements dynamically.
function GetUserFollowingSCB(data) {
    // console.log(data);
    FollowingPerformers = data;
    UpdateFollowingList();
}
// updates html elems
function UpdateFollowingList() {
    let counter = 1;
    let str = `<ul class="album_list_name"><li>#</li><li>Artist Name</li><li>Unfollow</li></ul>`;
    for (i in FollowingPerformers) {
    str += `<ul>
        <li onclick='PlayArtistSongsWithoutShuffle(${FollowingPerformers[i].performerID})'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li onclick="MoveToArtist(${FollowingPerformers[i].performerID})"><a href="javascript:void(0)" class="sNames">${FollowingPerformers[i].performerName}</a></li>
        <li><a href="javascript:void(0)"><span class="ms_close" onclick="UnfollowArtist(${FollowingPerformers[i].performerID})">
        <img src="images/svg/close.svg" alt=""></span></a></li></ul>`;
        counter++;
    }
    if (FollowingPerformers.length == 0) {
        str += `<p id="NoFavSongs">None</p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
// Unfollow artist (PUT to db)
function UnfollowArtist(id) {
    let UserID = GetUserID();
    if (UserID == undefined || UserID < 1) return;
    const api = `${apiStart}/Users/UnfollowArtist/UserID/${UserID}/PerformerID/${id}`;
    RemovedPerformerID = id;
    ajaxCall("DELETE", api, "", UnfollowArtistSCB, ECB);
  }
  // Update HTML elements.
  function UnfollowArtistSCB() {
    for (i in FollowingPerformers)
            if (FollowingPerformers[i].performerID == RemovedPerformerID) {
                FollowingPerformers.splice(parseInt(i), 1);
                break;
            }
            UpdateFollowing();
  }