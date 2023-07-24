// Called when the contact us page is loaded
function ContactUsLoaded() { // Gets playlist songs, updates audio player, and login info.
    // Saves whether we want our queue to loop
    IsLooped = false;
    FavoriteTryLogin();
    $("#ContactUsForm").submit(submitMessage);
    // HideAudioPlayer();
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
// Used to submit the question
function submitMessage() {
    if (!IsLoggedIn() || GetUserID() < 1) return;
    let subject = document.getElementById('SubjectTB').value;
    let content = document.getElementById('ContentTB').value;
    if (subject == "" || content == "") return;
    let Message = {
        "messageID": 0,
        "subject": subject,
        "content": content,
        "date": "2023-07-24T20:21:07.727Z",
        "userID": GetUserID(),
        "userName": "",
        "userEmail": ""
    };
    const api = `${apiStart}/Messages`;
    ajaxCall("POST", api, JSON.stringify(Message), submitMessageSCB, (e) => {
        document.getElementById('MsgSCB').style.display = "block";
        document.getElementById('MsgSCB').innerHTML = "An error has occured: " + e.responseJSON.message;
    });
    return false;
}
// on success, show indication
function submitMessageSCB (data) {
    if (data.success) {
        document.getElementById('MsgSCB').style.display = "block";
        document.getElementById('MsgSCB').innerHTML = "Your meesage was sent!";
    }
}