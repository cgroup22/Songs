// Called onload.
$(document).ready(function() {
    IsLooped = false; // Saves whether the queue is looped
    // Login and register forms
    $("#RegisterForm").submit(Register);
    $("#LoginForm").submit(Login);
    CheckAudioPlayer(); // updates queue and html if there's one.
    SearchTryLogin(); // if the user is logged in, updates html elements
    GetArtists(); // Gets the artists data and updates elems
    $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) { // Updates queue onchange.
      // Handle the song changing event here
      // console.log("Song changed:", event.jPlayer.status.media);
      HideMoreOptions();
    });
    document.addEventListener('keydown', function(event) { // Close login/register form when user clicks escape
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
});
function GetArtists() { // ajax call to get the artists data
    const api = `${apiStart}/Performers/GetArtists`;
    ajaxCall("GET", api, "", UpdateArtists, ECB);
}
// Updates artists html (by # of listeners)
function UpdateArtists(data) {
    //console.log(data);
    let ArtisDiv = document.getElementById('ArtistDiv');
    let str= "";
    for (i in data) {
        //console.log(`Artist${i}Image`)
        //console.log(document.getElementById(`Artist${i}Image`))
        str += `<div id="${data[i].performerID}" class="col-lg-2 col-md-6">
                            <div class="ms_rcnt_box marger_bottom30">
                                <div class="ms_rcnt_box_img">
                                    <img style="width:300px; height:250px;" src="${data[i].performerImage}" alt="" class="img-fluid">
                                    <div class="ms_main_overlay">
                                        <div class="ms_box_overlay"></div>
                                        <div class="ms_play_icon">
                                            <img onclick="PlayArtist(${data[i].performerID})" src="images/svg/play.svg" alt="">
                                        </div>
                                    </div>
                                </div>
                                <div class="ms_rcnt_box_text">
                                    <h3><a href="artist_single.html">${data[i].performerName}</a></h3>
                                </div>
                            </div>
                        </div>`
    }
    ArtisDiv.innerHTML = str;
}