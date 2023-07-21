// INIT
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

function ListenToGames() {
    // Listen to the games object
    database.ref('Games').on('value', function(snapshot) {
        var gamesData = snapshot.val();
        currentActiveGames = gamesData;
        UpdateActiveGames();
        // console.log('Data has changed:', gamesData);
  });
}
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
        if (null == currentActiveGames || !Object.keys(currentActiveGames).includes(myGameID)) {
            sessionStorage['game'] = "";
            window.location.href = `MultiplayerQuizzes.html`;
            console.log('oops')
            return;
        }
        Game = currentActiveGames[myGameID];
        sessionStorage['game'] = JSON.stringify(Game);
        if (Game != undefined && !Game.isWaitingForPlayers && Game.ownerID != GetUserID() && currentIndex == -1) {
            Quiz = Game.quiz;
            ShowQuestion();
            return;
        };
        if (Game != undefined && !Game.isWaitingForPlayers && Game.isActive && Game.ownerID != GetUserID() && Game.currentIndex > 0 && Game.currentIndex < Game.questions) {
            // console.log('hi');
            Quiz = Game.quiz;
            currentIndex = Game.currentIndex - 1;
            //if (timer == undefined) startTimer();
            console.log(document.getElementById('TurnOffOnGame').style.display)
            if (document.getElementById('TurnOffOnGame').style.display == '' || document.getElementById('TurnOffOnGame').style.display === 'block') {
                ShowQuestion();
                startTimer();
            }
            return;
        }
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