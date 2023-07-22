// Called when the page is loaded
function QHLoaded() { // inits firebase, updates login info and gets user quizzes to update.
    // Saves whether we want our queue to loop
    IsLooped = false;
    QuizHistoryTryLogin();
    initFirebase();
    UserID = GetUserID();
    if (UserID < 1) {
        openPopup("ERROR", "RED", "Login first!");
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        return;
    }
    //StartQuiz(UserID);
    GetQuizHistory(UserID);
    CheckAudioPlayer();
    $("#QuizForm").submit(function() {return false;})
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
// Tries to login and updates html on sucess. On error, leave page.
function QuizHistoryTryLogin() {
    if (!IsLoggedIn()) {
        openPopup('ERROR', "red", 'Log in first!');
        setTimeout(() => {location.href = `index.html`;}, 2000);
        return;
    }
    let data = localStorage['User'] == undefined || localStorage['User'] == "" ? JSON.parse(sessionStorage['User']) : JSON.parse(localStorage['User']);
    document.getElementById('LoginRegisterAccountHeader').innerHTML = `<a href="javascript:;" class="ms_admin_name" onclick="ToggleProfile()">Hello ${data.name.split(' ')[0]} <span class="ms_pro_name">${GetFirstLettersOfName(data.name)}</span></a><ul class="pro_dropdown_menu"><li><a href="profile.html">Profile</a></li>` + 
    //`<li><a href="manage_acc.html" target="_blank">Pricing Plan</a></li><li><a href="blog.html" target="_blank">Blog</a></li><li><a href="#">Setting</a></li>` +
    `<li><a onclick="Logout()" href="#">Logout</a></li></ul>`;
    document.getElementById('NeedsMSProfile').classList.add('ms_profile');
}
// Updates audio player.
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
// Gets solo quiz history
 function GetQuizHistory(UserID) {
  const api = `${apiStart}/Quizs/GetUserPastQuizzesWithoutQuestions/UserID/${UserID}`
  ajaxCall("GET", api, "", GetQuizHistorySCB, ECB);
 }
 // updates html elems
 function GetQuizHistorySCB(data) {
  Quizzes = data;
  BackToQuizzes();
  // console.log(data);
  document.getElementById('AllQuizzesData').style.display = 'none';
  document.getElementById('QuizEndScreen').style.display = 'block';
 }
 // Watch specific solo quiz info.
 function WatchQuiz(qID, grade, date) {
  const api = `${apiStart}/Quizs/GetQuizQuestions/QuizID/${qID}`;
  QuizGrade = grade;
  QuizDate = date;
  ajaxCall("GET", api, "", WatchQuizSCB, ECB);
 }
 // On sucess, update html and present quiz info (questions, answers, grade, date, etc..)
 function WatchQuizSCB(data) {
  // console.log(data);
  document.getElementById('AllQuizzesData').style.display = 'none';
  document.getElementById('QuizEndScreen').style.display = 'block';
  let str;
  if (QuizGrade != undefined)
  str = `<p style="color: white; font-size: 20px; margin-top: 30px;">Quiz Grade: ${QuizGrade}%</p>`;
  else str = ``;
  if (QuizDate != undefined)
  str += `<p style="color: white; font-size: 20px; margin-top: 30px;">Quiz Date: ${QuizDate}</p>`;
  for (i in data.questions) {
    if (data.questions[i] != undefined) {
      str += `<div class="Question"><h2 class="blueTitle" id="PostQuestionTitle">Question ${parseInt(i) + 1}:</h2>
  <p id="PostQuestionContent">${data.questions[i].content}</p>

  <div class="answer-group" style="display:block;">
    <div class="answer-option">
      <label id="PostAnswer0" style="background-color: ${data.questions[i].userAnswer != data.questions[i].correctAnswer && data.questions[i].correctAnswer == 0 ? "green" : "transparent"};">a) ${data.questions[i].answers[0]} ${data.questions[i].userAnswer == "0" ? data.questions[i].correctAnswer == 0 ? "✅" : "❌" : ""}</label><br>
    </div>
    <div class="answer-option">
      <label id="PostAnswer1" style="background-color: ${data.questions[i].userAnswer != data.questions[i].correctAnswer && data.questions[i].correctAnswer == 1 ? "green" : "transparent"};">b) ${data.questions[i].answers[1]} ${data.questions[i].userAnswer == "1" ? data.questions[i].correctAnswer == 1 ? "✅" : "❌" : ""}</label><br>
    </div>
  </div>

  <div class="answer-group" style="display:block;">
    <div class="answer-option">
      <label id="PostAnswer2" style="background-color: ${data.questions[i].userAnswer != data.questions[i].correctAnswer && data.questions[i].correctAnswer == 2 ? "green" : "transparent"};">c) ${data.questions[i].answers[2]} ${data.questions[i].userAnswer == "2" ? data.questions[i].correctAnswer == 2 ? "✅" : "❌" : ""}</label><br>
    </div>
    <div class="answer-option">
      <label id="PostAnswer3" style="background-color: ${data.questions[i].userAnswer != data.questions[i].correctAnswer && data.questions[i].correctAnswer == 3 ? "green" : "transparent"};">d) ${data.questions[i].answers[3]} ${data.questions[i].userAnswer == "3" ? data.questions[i].correctAnswer == 3 ? "✅" : "❌" : ""}</label><br>
    </div>
  </div></div>`;
  }
 }
 str += `<a class="ms_btn" style="color:white; margin:0; margin-top:10px;" href="javascript:void(0)" onclick="BackToQuizzes()">Back</a>`;
 document.getElementById('QuizEndScreen').innerHTML = str;
}
// Back to solo quizzes
function BackToQuizzes() {
  document.getElementById('AllQuizzesData').style.display = 'block';
  document.getElementById('QuizEndScreen').style.display = 'none';
  let counter = 1;
  let sum = 0;
  let str = `<ul class="album_list_name"><li>#</li><li class="text-center">Quiz Date</li><li class="text-center">Questions</li><li class="text-center">Grade</li><li class="text-center">Watch Quiz</li></ul>`;
  for (i in Quizzes) {
    str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li class="text-center"><a href="javascript:void(0)" class="sNames">${Quizzes[i].quizDate}</a></li>
        <li class="text-center"><a href="javascript:void(0)">5</a></li>` +
        `<li class="text-center"><a href="javascript:void(0)">${Quizzes[i].quizGrade}%</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:void(0);" onclick="WatchQuiz(${Quizzes[i].quizID}, ${Quizzes[i].quizGrade}, '${String(Quizzes[i].quizDate)}')"><span class="ms_icon1 ms_active_icon"></span></a>`
            +
        //<li style="text-align:center;"><a href="javascript:void(0)"><span class="opt_icon"><span class="icon icon_dwn"></span></span>Download</a></li>
        //`<li class="text-center"><a href="javascript:void(0)"><span class="ms_close" onclick="RemoveFromFavorites(${FavoriteSongs[i].songID})">
                //`<img src="images/svg/close.svg" alt=""></span></a></li>
    `</ul>`;
    sum += Quizzes[i].quizGrade;
    counter++;
  }
  if (Quizzes.length == 0) {
    str += `<p id="NoFavSongs">You never took any quizzes!</p>`;
    document.getElementById("QuizAverageGrade").style.display = 'none';
  }
  else {
    document.getElementById("QuizAverageGrade").innerHTML = `Your Average: ${(sum / Quizzes.length).toFixed(2)}%`;
  }
  document.getElementById('FavoritesContainer').innerHTML = str;
}
// Watch solo quizzes
function WatchSolo() {
  document.getElementById('FavoritesContainer').style.display = `block`;
  document.getElementById('AllQuizzesData').style.display = `block`;
  document.getElementById('MPQuizzesContainer').style.display = `none`;
  document.getElementById('BTNS').style.display = `none`;
}
// Watch multiplayer quizzes
function WatchMP() {
  document.getElementById('FavoritesContainer').style.display = `none`;
  document.getElementById('MPQuizzesContainer').style.display = `block`;
  document.getElementById('AllMPQuizzesData').style.display = `block`;
  document.getElementById('BTNS').style.display = `none`;
}
// go back to choices
function Back() {
  document.getElementById('FavoritesContainer').style.display = `none`;
  document.getElementById('MPQuizzesContainer').style.display = `none`;
  document.getElementById('AllQuizzesData').style.display = `none`;
  document.getElementById('AllMPQuizzesData').style.display = `none`;
  document.getElementById('BTNS').style.display = `block`;
}