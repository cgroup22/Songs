// Called when the favorites page is loaded
function LeaderboardLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    LeaderboardLogin(); // logs in if there's anything in the storage, moves to index.html if the user is not logged in
    UpdateLeaderboard(); // ajax to get leaderboard info and updates the page
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
// logs in if there's anything in the storage.
function LeaderboardLogin() {
    if (!IsLoggedIn()) {
        return;
    }
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
// ajax call to get leaderboard
function UpdateLeaderboard() {
    const api = `${apiStart}/Users/GetLeaderboard`;
    ajaxCall("GET", api, "", UpdateLeaderboardSCB, ECB);
}
// updates html elems
function UpdateLeaderboardSCB(data) {
    // console.log(data);
    let counter = 1;
    let str = `<ul class="album_list_name"><li style="width:3%;">#</li><li>Name</li><li style="width:5%;">Level</li>
    <li class="text-center">Solo Average</li><li class="text-center">Solo Games Played</li><li class="text-center">Total Solo Right Questions</li>
    <li class="text-center">XP</li></ul>`;
    for (i in str) {
        if (data[i] == undefined) break;
        str += `<ul>
        <li style="width:3%;"><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span></a></li>
        <li><a href="javascript:void(0)" class="sNames">${data[i].userName}</a></li>
        <li style="width:5%;"><a href="javascript:void(0)">${data[i].level}</a></li>` +
        `<li class="text-center"><a href="javascript:void(0)">${data[i].soloAverage.toFixed(2)}%</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:;">${data[i].gamesPlayed}</a>
        <li class="text-center ms_more_icon"><a href="javascript:;">${data[i].soloQuestionsGotRight}</a>
        <li class="text-center ms_more_icon"><a href="javascript:;">${data[i].xp}</a></ul>`;
    counter++;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}