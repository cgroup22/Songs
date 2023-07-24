function MPQLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    GamesTryLogin(); // logs in and updates html
    CheckAudioPlayer(); // updates queue
    initFirebase(); // inits firebase
    $("#QuizForm").submit(() => { return false; }); // prevets the page from reloading when the user answers a question
    // Takes care of updating html elements on play and adding/removing songs from the queue.
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) { // Hides more options in queue.
        HideMoreOptions();
      });
      // if no game is saved, go back/
    if (sessionStorage['game'] == undefined || sessionStorage['game'] == "")
      window.location.href = `MultiplayerQuizzes.html`;
    Game = JSON.parse(sessionStorage['game']); // otherwise, get the game update necessary data.
    // console.log(Game)
    // console.log(Game.currentIndex)
    if (Game != undefined && Game.currentIndex != undefined)
    currentIndex = Game.currentIndex - 1;
    else currentIndex = -1;
    // temp for queue updating.
    /*$("#jquery_jplayer_1").bind($.jPlayer.event.play, function (event) { //d
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
      });*/
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        HideMoreOptions();
      });
    // console.log(currentIndex)
    UpdatePlayers();
}
// Updates players in game.
function UpdatePlayers() {
    let str = `<ul class="album_list_name">
    <li>#</li>
    <li>Players</li>
</ul>`;
let counter = 1;
    for (i of Game.players) {
        str += `<ul>
        <li><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
        <li><a href="javascript:void(0)">${i.name}</a></li>
    </ul>`;
    counter++;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
    if (Game.ownerID == GetUserID() && Game.players.length > 1) {
        document.getElementById('StartGameBTN').style.display = 'block';
    } else document.getElementById('StartGameBTN').style.display = 'none';
}
// Leaves current game.
function LeaveGame() {
    let UserID = GetUserID();
    if (UserID == undefined || UserID < 1) return;
    let gameId = JSON.parse(sessionStorage['game']).id;
    database.ref('Games').orderByChild('id').equalTo(gameId).once('value')
    .then(function(snapshot) {
        const gameData = snapshot.val();
        if (gameData) {
            // The snapshot will contain an object of games with matching gameId (usually just one)
            // To extract the game data, you can use Object.values() to convert the object to an array
            const gameArray = Object.values(gameData);
            const game = gameArray[0]; // Assuming there's only one game with this ID
            // console.log('Game data for ID ' + gameId + ':', game);
            // You can use the "game" object here or call another function to handle it.
            if (!IsPlayerInGame(game)) {
                console.log("Player not in game");
                sessionStorage['game'] = ``;
                window.location.href = `MultiplayerQuizzes.html`;
                return;
            }
            if (UserID == gameData[JSON.parse(sessionStorage['game']).id].ownerID) {
                const gameRef = database.ref('Games').child(gameId);
                    gameRef.remove()
                        .then(function() {
                            console.log("Game removed successfully!");
                            sessionStorage['game'] = "";
                            window.location.href = `MultiplayerQuizzes.html`;
                        })
                        .catch(function(error) {
                            console.error('Error removing game:', error);
                        });
                return;
            }
            else {
                game.players.splice(getIndexOfPlayerByID(game.players, UserID), 1);
            const gameRef = database.ref('Games').child(gameId);
            gameRef.update(game)
            .then(function() {
                console.log("Left game " + game.id);
                sessionStorage['game'] = "";
                window.location.href = `MultiplayerQuizzes.html`;
            })
            .catch(function(error) {
                 console.error('Error updating game data:', error);
            });
            }
            } else {
                console.log('Game not found for ID ' + gameId);
            }
    })
    .catch(function(error) {
        console.error('Error getting game data for ID ' + gameId + ':', error);
    });
}
// Get index of player by its id from players array of game.
function getIndexOfPlayerByID(players, id) {
    for (i in players) {
        if (players[i].id == id)
            return parseInt(i);
    }
    return -1;
}
// returns true if player is in this game, false otherwise.
function IsPlayerInGame(game) {
    let UserID = GetUserID();
    if (UserID == undefined || UserID < 1) return;
    for (i of game.players) {
        if (i.id == UserID) {
            return true;
        }
    }
    return false;
}
// Starts game. use ajax call to get the quiz questions from C# server
function StartGame() {
    const api = `${apiStart}/Quizs/GetQuizForFirebase`;
    ajaxCall("GET", api, "", GenerateQuizSCB, ECB);
}
// Generates quiz and updates quiz question on firebase
function GenerateQuizSCB(data) {
    let date = GetDate();
    delete data['userID'];
    delete data['quizID'];
    data.quizDate = date;
    data.quizDate = date; 
    for (i of data.questions) {
        delete i['id'];
        i.userAnswer = [];
        for (j of Game.players) {
            let playerAnswers = {
                "UserID": j.id,
                "Answers": -1
            };
            i.userAnswer.push(playerAnswers);
        }
    }
    Game.isWaitingForPlayers = false;
    Game.currentIndex = 0;
    Game.quiz = data;
    // console.log(Game);
    const gameRef = database.ref('Games').child(Game.id);

    // Use the update method to update specific properties of the game object
    gameRef.update(Game)
        .then(function() {
            sessionStorage['game'] = JSON.stringify(Game);
            // Start game
            document.getElementById('QuizEndScreen').style.display = 'none';
            document.getElementById('QuestionDiv').style.display = 'block';
            Quiz = Game.quiz;
            ShowQuestion();
        })
        .catch(function(error) {
            console.error('Error updating game:', error);
        });
}
// On quiz end, update html and XP of players.
function QuizEnd() {
    StopMusic();
    document.getElementById('QuizSound').style.display = 'none';
    sessionStorage['game'] = "";
    document.getElementById('QuizEndScreen').style.display = 'block';
    document.getElementById('QuestionDiv').style.display = 'none';
    let uid = GetUserID();
    let str = `<p id="winners" style="color:white;text-align:center;margin:5px;font-size:23px;"></p>
    <p id="YourCorrect" style="color:white;text-align:center;margin:5px;font-size:23px;"></p>`;
    let q = 1;
    let countQ = 0;
    for (i of Game.quiz.questions) {
        for (j of i.userAnswer)
        if (j.UserID == uid) {
            str += `<div class="Question"><h2 class="blueTitle" id="PostQuestionTitle">Question ${q}:</h2>
        <p id="PostQuestionContent">${i.content}</p>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer0" style="background-color: ${j.Answers != i.correctAnswer && i.correctAnswer == 0 ? "green" : "transparent"};">a) ${i.answers[0]} ${j.Answers == 0 ? i.correctAnswer == 0 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer1" style="background-color: ${j.Answers != i.correctAnswer && i.correctAnswer == 1 ? "green" : "transparent"};">b) ${i.answers[1]} ${j.Answers == 1 ? i.correctAnswer == 1 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div>
    
        <div class="answer-group" style="display:block;">
          <div class="answer-option">
            <label id="PostAnswer2" style="background-color: ${j.Answers != i.correctAnswer && i.correctAnswer == 2 ? "green" : "transparent"};">c) ${i.answers[2]} ${j.Answers == 2 ? i.correctAnswer == 2 ? "✅" : "❌" : ""}</label><br>
          </div>
          <div class="answer-option">
            <label id="PostAnswer3" style="background-color: ${j.Answers != i.correctAnswer && i.correctAnswer == 3 ? "green" : "transparent"};">d) ${i.answers[3]} ${j.Answers == 3 ? i.correctAnswer == 3 ? "✅" : "❌" : ""}</label><br>
          </div>
        </div></div>`;
        // Used to add 10 XP to the user's level for each question he got right
        countQ = j.Answers == i.correctAnswer ? countQ + 1 : countQ;
        }
        q++;
    }
    str += `<a class="ms_btn" id="TakeQuizBTN" href="MultiplayerQuizzes.html" style="margin:auto; margin-top:40px;">Play again</a>`;
    document.getElementById('QuizEndScreen').innerHTML = str;
    CalculateWinners(Game);
    // Adding 10 XP to the user for each question he got right
    const api = `${apiStart}/Users/AddUserXP/UserID/${GetUserID()}/XP/${countQ * 10}`;
    ajaxCall("PUT", api, "", () => {}, (e) => { console.log(e); });
}
// Calculates who won the game.
function CalculateWinners(game) {
    let players = game.players;
    for (i of players)
        i.correct = 0;
    for (i of game.quiz.questions) {
        for (x of i.userAnswer) {
            for (j of players) {
                if (x.UserID == j.id) {
                    if (x.Answers == i.correctAnswer)
                        j.correct++;
                    break;
                }
            }
        }
    }
    let max = -1;
    for (i of players)
    {
        if (i.correct > max)
            max = i.correct;
    }
    let YC = 0;
    let winners = [];
    if (max != 0)
        for (i of players) {
            if (i.correct == max)
                winners.push(i);
            if (i.id == GetUserID())
                YC = i.correct;
        }
    if (winners.length == 0)
        document.getElementById('winners').innerHTML = `No Winners`;
    else if (winners.length == 1) {
        document.getElementById('winners').innerHTML = `Winner: ${winners[0].name} with ${winners[0].correct} right questions!`;
    } else {
        let str = `Players tied for the win: `;
        for(i in winners) {
            str += `${winners[i].name}`;
            if (parseInt(i) != winners.length - 1)
                str += `, `;
            else str += ` with ${winners[i].correct} right questions!`;
        }
        document.getElementById('winners').innerHTML = str;
        document.getElementById('YourCorrect').innerHTML = `You got ${YC} questions right!`;
    }
    if (GetUserID() == game.ownerID) {
        if (winners.length == 0) {
            for (i of game.players)
                i.won = false;
        }
        else {
            for (i of game.players) {
                let tmp = false;
                for (j of winners) {
                    if (i.id == j.id) {
                        tmp = true;
                        break;
                    }
                }
               i.won = tmp;
            }
        }
        game.finished = true;
        const gameRef = database.ref('Games').child(game.id);
    // Use the update method to modify specific properties of the game
    gameRef.update(game)
        .then(function() {
            // console.log('Game updated successfully!');
        })
        .catch(function(error) {
            // console.error('Error updating game:', error);
        });
    }
}
// Shows the next question to the player.
function ShowQuestion() {
    currentIndex++;
    console.log("local currentIndex: " + currentIndex);
    if (currentIndex >= Quiz.questions.length) {
        clearInterval(timer);
        timerElement.textContent = "";
        if (GetUserID() == Game.ownerID)
            QuizEnd();
        return;
    }
    if (GetUserID() == Game.ownerID && currentIndex != 0) {
        totalSeconds = 19;
        timerElement.textContent = `00:20`;
    }
    else if (currentIndex == 0) {
        startTimer();
    } else {
        totalSeconds = 20;
        timerElement.textContent = `00:20`;
    }
    if (document.getElementById('SubmitBTN').style.display == 'none')
    document.getElementById('SubmitBTN').style.display='initial';
    console.log(Quiz)
    if (document.querySelector('input[name="q1"]:checked') != null)
        document.querySelector('input[name="q1"]:checked').checked = false;
    document.getElementById('QuestionTitle').innerHTML = `Question ${currentIndex + 1}:`;
    document.getElementById('QuestionContent').innerHTML = Quiz.questions[currentIndex].content;
    document.getElementById('SubmitBTN').setAttribute('QuestionID', Quiz.questions[currentIndex].id);
    document.getElementById(`Answer0`).innerHTML = `a) ${Quiz.questions[currentIndex].answers[0]}`;
    document.getElementById(`Answer1`).innerHTML = `b) ${Quiz.questions[currentIndex].answers[1]}`;
    document.getElementById(`Answer2`).innerHTML = `c) ${Quiz.questions[currentIndex].answers[2]}`;
    document.getElementById(`Answer3`).innerHTML = `d) ${Quiz.questions[currentIndex].answers[3]}`;
    document.getElementById('QuizQuestions').style.display = `block`;
    document.getElementById('TurnOffOnGame').style.display = `none`;
    document.getElementById('SubmitBTN').setAttribute('onclick', `submitQuestion()`);
}
// Get current date (to save quiz date)
function GetDate() {
    const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

// This arrangement can be altered based on how we want the date's format to appear.
let currentDate = `${day}-${month}-${year}`;
return currentDate;
}
// submits user answer to current question
function submitQuestion() {
    if (Game == undefined || Game.isWaitingForPlayers == true) return;
    if (document.querySelector('input[name="q1"]:checked') == null) return;
    for (user in Game.quiz.questions[currentIndex].userAnswer) {
        if(Game.quiz.questions[currentIndex].userAnswer[user].UserID == GetUserID()) {
            let ans = document.querySelector('input[name="q1"]:checked').value;
            Game.quiz.questions[currentIndex].userAnswer[user].Answers = parseInt(ans);
            break;
        }
    }
    const gameRef = database.ref('Games').child(Game.id);
            gameRef.update(Game)
            .then(function() {
                /*console.log("Left game " + game.id);
                sessionStorage['game'] = "";
                window.location.href = `MultiplayerQuizzes.html`;*/
                // Wait
                document.getElementById('SubmitBTN').style.display = 'none';
            })
            .catch(function(error) {
                 console.error('Error updating game data:', error);
            });
}
// TIMER STARTS
 // Timer variables
 var timerElement = document.getElementById("timer");
 var totalSeconds = 20; // 3 minutes (3 minutes * 60 seconds)

 // Start the timer
 function startTimer() {
     timerElement = document.getElementById("timer");
     timerElement.innerHTML = `00:20`;
     totalSeconds = 20;
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

     if (totalSeconds <= 0 && Game.ownerID == GetUserID()) {
        if (currentIndex >= Game.questions)
            clearInterval(timer);
         // timerElement.textContent = "Time's up!";
         NextQuestion();
         // Add any additional logic when the timer reaches zero
     }
     else if (totalSeconds <= 0) {
        ShowQuestion();
     }
     totalSeconds--;
 }
 // TIMER FINISH
 // Used to update the game to the next question (happens once, only on owner's computer)
 function NextQuestion() {
    if (Game.finished) return;
    Game.currentIndex++;
    if (Game.currentIndex >= Game.questions)
        Game.isActive = false;
    const gameRef = database.ref('Games').child(Game.id);

    // Use the update method to update specific properties of the game object
    gameRef.update(Game)
        .then(function() {
            if (Game.currentIndex < Game.questions)
                sessionStorage['game'] = JSON.stringify(Game);
            else sessionStorage['game'] = "";
            // Start game
            ShowQuestion();
        })
        .catch(function(error) {
            console.error('Error updating game:', error);
        });
    
 }