// INIT db
function initFirebase() {
    const firebaseConfig = {
        apiKey: "AIzaSyAR8fZvrfGOqygweDnWVmWsQkjmnXYSLbs",
        authDomain: "bennysfinalproject.firebaseapp.com",
        projectId: "bennysfinalproject",
        storageBucket: "bennysfinalproject.appspot.com",
        messagingSenderId: "740588169462",
        appId: "1:740588169462:web:547e9c35fb038af59fa4d7",
        measurementId: "G-WPXWGFS8N3",
        databaseURL: "https://bennysfinalproject-default-rtdb.firebaseio.com/"
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.analytics();
    database = firebase.database();
    //UpdateActiveGames();
    if (location.href.split("/").slice(-1)[0] === "MultiplayerQuizzes.html")
    ListenToGames();
    if (location.href.split("/").slice(-1)[0] === "MPQuizzesGame.html")
    SetGame();
    if (location.href.split("/").slice(-1)[0] === "quizhistory.html") {
        UpdatePastMPGames();
        return;
    }
    if (location.href.split("/").slice(-1)[0] === "managePortal.html") {
        GetHowManyMPGames();
        return;
    }
    window.addEventListener('beforeunload', function(event) {
        // Perform any actions or show a confirmation message here
        // You can use 'event.returnValue' to set a custom message in some browsers (deprecated)
        //event.returnValue = "Are you sure you want to leave?";
        if (Game != undefined && GetUserID() == Game.ownerID && Game.isActive) {
            const gameRef = database.ref('Games').child(Game.id);

    // Use the remove method to delete the game from the database
    gameRef.remove()
        .then(function() {
            // console.log('Game deleted successfully!');
        })
        .catch(function(error) {
            console.error('Error deleting game:', error);
        });
        }
    });    
}
// END INIT
// Gets how many multiplayer quizzes are there
function GetHowManyMPGames() {
        database.ref('Games').once('value')
        .then(function(snapshot) {
          Games = snapshot.val();
          MPQuizzes = Object.keys(Games).length;
        })
        .catch(function(error) {
          console.error('Error retrieving active games: ', error);
        });
}

// Used to update the multiplayer games in quizhistory
function UpdatePastMPGames() {
    database.ref('Games').once('value')
    .then(function(snapshot) {
      Games = snapshot.val();
      let str = ``;
      // console.log(Games);
      for (i of Object.keys(Games)) {
        let tmp = false;
        // remove games that this users hasn't played
        for (player of Games[i].players) {
            if (player.id == GetUserID()) {
                tmp = true;
                break;
            }
        }
        if (!tmp) { // delete games if user has not played there.
           delete Games[i];
        }
      }
      // Now we have this user's games.
      let counter = 1;
      let sumGrade = 0;
      for (i of Object.keys(Games)) {
        let countCorrectQuestions = 0;
        for (j of Games[i].quiz.questions) {
            for (x of j.userAnswer)
                if (x.UserID == GetUserID() && x.Answers == j.correctAnswer)
                countCorrectQuestions++;
        }
        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li class="text-center"><a href="javascript:void(0)" class="sNames">${Games[i].quiz.quizDate}</a></li>
        <li class="text-center"><a href="javascript:void(0)">5</a></li>` +
        `<li class="text-center"><a href="javascript:void(0)">${((countCorrectQuestions / Games[i].questions) * 100).toFixed(2)}%</a></li>
        <li class="text-center ms_more_icon"><a href="javascript:void(0);" onclick="WatchMPQuiz('${i}', ${((countCorrectQuestions / Games[i].questions) * 100).toFixed(2)})"><span class="ms_icon1 ms_active_icon"></span></a>`
    + `</ul>`;
    counter++;
    sumGrade += ((countCorrectQuestions / Games[i].questions) * 100);
    // console.log("Counter: " + ((countCorrectQuestions / Games[i].questions) * 100));
      }
      //console.log(sumGrade);
      //console.log(counter);
      if (Games.length == 0) {
        str += `<p id="NoFavSongs">You never took any quizzes!</p>`;
        document.getElementById("MPQuizAverageGrade").style.display = 'none';
      }
      else {
        document.getElementById("MPQuizAverageGrade").innerHTML = `Your Average: ${(sumGrade / (counter - 1)).toFixed(2)}%`;
      }
      str += ``;
      document.getElementById('MPQuizzesContainer').innerHTML = str;
      console.log(Games);
    })
    .catch(function(error) {
      console.error('Error retrieving active games: ', error);
      document.getElementById('MPBTN').style.display = `none`;
    });
}
// Retrieves the data on the chosen quiz to show on quizhistory.html
function WatchMPQuiz(id, grade) {
    if (Games == undefined) {
        openPopup('ERROR', 'red', "Couldn't retrieve data!");
        return;
    }
    // console.log(Games[id]);
    document.getElementById('AllMPQuizzesData').style.display = 'none';
  document.getElementById('QuizEndScreen').style.display = 'block';
  let str;
  if (grade != undefined)
  str = `<p style="color: white; font-size: 20px; margin-top: 30px;">Quiz Grade: ${grade}%</p>`;
  else str = ``;
  if (Games[id]?.quiz?.quizDate != undefined)
  str += `<p style="color: white; font-size: 20px; margin-top: 30px;">Quiz Date: ${Games[id].quiz.quizDate}</p>`;
  if (Games[id]?.players?.length > 0) {
    str += `<p style="color: white; font-size: 20px; margin-top: 30px;">Players: `;
  for (i in Games[id].players) {
    str += `${Games[id].players[i].name}(${Games[id].players[i].id})`;
    if (parseInt(i) != Games[id].players.length - 1)
        str += `, `;
  }
  str += `</p>`;
  }
  for (i in Games[id]?.quiz?.questions) {
    for (j of Games[id]?.quiz?.questions[i].userAnswer)
    if (j.UserID == GetUserID()) {
        if (Games[id].quiz.questions[i] != undefined) {
            str += `<div class="Question"><h2 class="blueTitle" id="PostQuestionTitle">Question ${parseInt(i) + 1}:</h2>
        <p id="PostQuestionContent">${Games[id].quiz.questions[i].content}</p>
      
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer0" style="background-color: ${j.Answers != Games[id].quiz.questions[i].correctAnswer && Games[id].quiz.questions[i].correctAnswer == 0 ? "green" : "transparent"};">a) ${Games[id].quiz.questions[i].answers[0]} ${j.Answers == 0 ? Games[id].quiz.questions[i].correctAnswer == 0 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer1" style="background-color: ${j.Answers != Games[id].quiz.questions[i].correctAnswer && Games[id].quiz.questions[i].correctAnswer == 1 ? "green" : "transparent"};">b) ${Games[id].quiz.questions[i].answers[1]} ${j.Answers == 1 ? Games[id].quiz.questions[i].correctAnswer == 1 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div>
      
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer2" style="background-color: ${j.Answers != Games[id].quiz.questions[i].correctAnswer && Games[id].quiz.questions[i].correctAnswer == 2 ? "green" : "transparent"};">c) ${Games[id].quiz.questions[i].answers[2]} ${j.Answers == 2 ? Games[id].quiz.questions[i].correctAnswer == 2 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer3" style="background-color: ${j.Answers != Games[id].quiz.questions[i].correctAnswer && Games[id].quiz.questions[i].correctAnswer == 3 ? "green" : "transparent"};">d) ${Games[id].quiz.questions[i].answers[3]} ${j.Answers == 3 ? Games[id].quiz.questions[i].correctAnswer == 3 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div></div>`;
        }
        continue;
    }
 }
 str += `<a class="ms_btn" style="color:white; margin:0; margin-top:10px;" href="javascript:void(0)" onclick="BackToMPQuizzes()">Back</a>`;
 document.getElementById('QuizEndScreen').innerHTML = str;
}
// Go back to all mp quizzes
function BackToMPQuizzes() {
    document.getElementById('QuizEndScreen').style.display = `none`;
    document.getElementById('AllMPQuizzesData').style.display = 'block';
}
// Listen to Games object change on Firebase
function ListenToGames() {
    // Listen to the games object
    database.ref('Games').on('value', function(snapshot) {
        var gamesData = snapshot.val();
        currentActiveGames = gamesData;
        UpdateActiveGames();
        // console.log('Data has changed:', gamesData);
  });
}
// Updates game object on clients.
function SetGame() {
    // Listen to the games object
    database.ref('Games').on('value', function(snapshot) {
        var gamesData = snapshot.val();
        currentActiveGames = gamesData;
        console.log(currentActiveGames)
        if ((sessionStorage['game'] == undefined || sessionStorage['game'] == "")) return;
        let myGameID = JSON.parse(sessionStorage['game']).id;
        /*console.log(currentActiveGames)
        console.log(Object.keys(currentActiveGames))
        console.log(myGameID)
        console.log(!Object.keys(currentActiveGames).includes(currentActiveGames))*/
        if (null == currentActiveGames || !Object.keys(currentActiveGames).includes(myGameID)) { // if current game was closed or finished, delete from storage and go back.
            sessionStorage['game'] = "";
            window.location.href = `MultiplayerQuizzes.html`;
            return;
        }
        Game = currentActiveGames[myGameID];
        sessionStorage['game'] = JSON.stringify(Game);
        if (Game != undefined && !Game.isWaitingForPlayers && Game.ownerID != GetUserID() && currentIndex == -1) { // Called on game starts, on clients which are not the owner.
            Quiz = Game.quiz;
            ShowQuestion();
            return;
        };
        // Called when the game object was changed, but not on start game. Needs to change question on screen etc..
        if (Game != undefined && !Game.isWaitingForPlayers && Game.isActive && Game.ownerID != GetUserID() && Game.currentIndex > 0 && Game.currentIndex < Game.questions) {
            // console.log('hi');
            Quiz = Game.quiz;
            //currentIndex = Game.currentIndex - 1;
            //if (timer == undefined) startTimer();
            console.log(document.getElementById('TurnOffOnGame').style.display)
            if (document.getElementById('TurnOffOnGame').style.display == '' || document.getElementById('TurnOffOnGame').style.display === 'block') {
                ShowQuestion();
                currentIndex++;
                startTimer();
            }
            return;
        }
        // Game finished, updates the html results on clients which are not the owner of the game.
        if (GetUserID() != Game.ownerID && Game.currentIndex >= Game.questions) {
            if (timer != undefined)
            clearInterval(timer);
            if (timerElement != undefined)
            timerElement.textContent = "";
            QuizEnd();
            return;
        }
        UpdatePlayers();
        // console.log('Data has changed:', gamesData);
  });
}