// ATTENTION: THESE ARE THE SOLO QUIZZES.

// Called when the favorites page is loaded
function FavLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    QuizTryLogin();
    UserID = GetUserID();
    if (UserID < 1) {
        openPopup("ERROR", "RED", "Login first!");
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        return;
    }
    StartQuiz(UserID);
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
// Updates login html elems
function QuizTryLogin() {
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
// Updates audio player
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
// Starts quiz, generates questions and saves info to db
function StartQuiz(UserID) {
    currentIndex = 0;
    const api = `${apiStart}/Quizs/StartQuiz/UserID/${UserID}`;
    ajaxCall("POST", api, "", StartQuizSCB, ECB);
}
// on sucess, update elems, start timer, and show first question
function StartQuizSCB(data) {
    startTimer();
    document.getElementById('QuizEndScreen').style.display = 'none';
    document.getElementById('QuestionDiv').style.display = 'block';
    // console.log(data);
    Quiz = data;
    ShowQuestion();
}
// shows the next question of the quiz
function ShowQuestion() {
    if (currentIndex >= Quiz.questions.length) {
        QuizEnd();
        StopMusic();
        return;
    }
    if (document.querySelector('input[name="q1"]:checked') != null)
        document.querySelector('input[name="q1"]:checked').checked = false;
    document.getElementById('QuestionTitle').innerHTML = `Question ${currentIndex + 1}:`;
    document.getElementById('QuestionContent').innerHTML = Quiz.questions[currentIndex].content;
    document.getElementById('SubmitBTN').setAttribute('QuestionID', Quiz.questions[currentIndex].id);
    document.getElementById(`Answer0`).innerHTML = `a) ${Quiz.questions[currentIndex].answers[0]}`;
    document.getElementById(`Answer1`).innerHTML = `b) ${Quiz.questions[currentIndex].answers[1]}`;
    document.getElementById(`Answer2`).innerHTML = `c) ${Quiz.questions[currentIndex].answers[2]}`;
    document.getElementById(`Answer3`).innerHTML = `d) ${Quiz.questions[currentIndex].answers[3]}`;
    document.getElementById('SubmitBTN').setAttribute('onclick', `SubmitQuestion()`);
    currentIndex++;
}
// submits user answer to the question
function SubmitQuestion() {
    if (document.querySelector('input[name="q1"]:checked') == null) return;
    // console.log(document.querySelector('input[name="q1"]:checked').value)
    // console.log(document.querySelector('input[name="q1"]:checked').value == Quiz.questions[currentIndex - 1].correctAnswer);
    Quiz.questions[currentIndex - 1]["userAnswer"] = document.querySelector('input[name="q1"]:checked').value;
    const api = `${apiStart}/Questions/UpdateUserAnswer/QuestionID/${Quiz.questions[currentIndex - 1].id}/Answer/${document.querySelector('input[name="q1"]:checked').value}`;
    ajaxCall("PUT", api, "", ShowQuestion, ECB);
}
// quiz ended, show end screen with info about questions
function QuizEnd() {
    if (totalSeconds > 0) {
        clearInterval(timer);
        timerElement.textContent = "";
    }
    document.getElementById('QuizEndScreen').style.display = 'block';
    document.getElementById('QuestionDiv').style.display = 'none';
    let str = ``;
    for (i in Quiz.questions) {
        if (Quiz.questions[i] != undefined) {
            str += `<div class="Question"><h2 class="blueTitle" id="PostQuestionTitle">Question ${parseInt(i) + 1}:</h2>
        <p id="PostQuestionContent">${Quiz.questions[i].content}</p>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer0" style="background-color: ${Quiz.questions[i].userAnswer != Quiz.questions[i].correctAnswer && Quiz.questions[i].correctAnswer == 0 ? "green" : "transparent"};">a) ${Quiz.questions[i].answers[0]} ${Quiz.questions[i].userAnswer == "0" ? Quiz.questions[i].correctAnswer == 0 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer1" style="background-color: ${Quiz.questions[i].userAnswer != Quiz.questions[i].correctAnswer && Quiz.questions[i].correctAnswer == 1 ? "green" : "transparent"};">b) ${Quiz.questions[i].answers[1]} ${Quiz.questions[i].userAnswer == "1" ? Quiz.questions[i].correctAnswer == 1 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer2" style="background-color: ${Quiz.questions[i].userAnswer != Quiz.questions[i].correctAnswer && Quiz.questions[i].correctAnswer == 2 ? "green" : "transparent"};">c) ${Quiz.questions[i].answers[2]} ${Quiz.questions[i].userAnswer == "2" ? Quiz.questions[i].correctAnswer == 2 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer3" style="background-color: ${Quiz.questions[i].userAnswer != Quiz.questions[i].correctAnswer && Quiz.questions[i].correctAnswer == 3 ? "green" : "transparent"};">d) ${Quiz.questions[i].answers[3]} ${Quiz.questions[i].userAnswer == "3" ? Quiz.questions[i].correctAnswer == 3 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div></div>`;
        } else {
            str += `<div class="Question"><h2 class="blueTitle" id="PostQuestionTitle">Question ${parseInt(i) + 1}:</h2>
        <p id="PostQuestionContent">${Quiz.questions[i].content}</p>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer0" style="background-color: ${Quiz.questions[i].correctAnswer == 0 ? "green" : "transparent"};">a) ${Quiz.questions[i].answers[0]}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer1" style="background-color: ${Quiz.questions[i].correctAnswer == 1 ? "green" : "transparent"};">b) ${Quiz.questions[i].answers[1]}</label><br>
          </div>
        </div>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer2" style="background-color: ${Quiz.questions[i].correctAnswer == 2 ? "green" : "transparent"};">c) ${Quiz.questions[i].answers[2]}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer3" style="background-color: ${Quiz.questions[i].correctAnswer == 3 ? "green" : "transparent"};">d) ${Quiz.questions[i].answers[3]}</label><br>
          </div>
        </div></div>`;
        }
    }
    str += `<a class="ms_btn" id="TakeQuizBTN" href="javascript:void(0)" onclick="StartQuiz(${UserID})" style="margin:auto; margin-top:40px;">Take Another Quiz</a>`;
    document.getElementById('QuizEndScreen').innerHTML = str;
}
// START TIMER
 // Timer variables
 var timerElement = document.getElementById("timer");
 var totalSeconds = 180; // 3 minutes (3 minutes * 60 seconds)

 // Start the timer
 function startTimer() {
     timerElement = document.getElementById("timer");
     timerElement.innerHTML = `03:00`;
     totalSeconds = 180;
     timer = setInterval(updateTimer, 1000);
 }

 // Update the timer display
 function updateTimer() {
     var minutes = Math.floor(totalSeconds / 60);
     var seconds = totalSeconds % 60;

     // Format the timer value
     var formattedTime = (minutes > 9 ? minutes : "0" + minutes) +
         ":" + (seconds > 9 ? seconds : "0" + seconds);

     // Update the timer element
     timerElement.textContent = formattedTime;

     if (totalSeconds <= 0) { // ran out of time for the quiz.
         clearInterval(timer);
         timerElement.textContent = "Time's up!";
         QuizEnd();
         // Add any additional logic when the timer reaches zero
     }

     totalSeconds--;
 }
 // END TIMER