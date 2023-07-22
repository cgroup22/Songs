// Called when the multiplayer lobby page is loaded
function MPLobbyLoaded() {
    // Saves whether we want our queue to loop
    IsLooped = false;
    GamesTryLogin(); // logs in if there's a user saved in our storage.
    CheckAudioPlayer(); // updates queue
    CheckIsVerified(); // if not verified, go to index.html
    initFirebase(); // inits firebase
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
      // updates html on queue change
      $("#jquery_jplayer_1").bind($.jPlayer.event.setmedia, function (event) {
        HideMoreOptions();
      });
      // updates current active games for the player to join
      setTimeout(() => {
        if (currentActiveGames != null) {
            for (i of Object.keys(currentActiveGames)) {
                if (currentActiveGames[i].isActive) {
                    for (j of currentActiveGames[i].players)
                        if (j.id == GetUserID()) {
                            Game = currentActiveGames[i];
                            sessionStorage['game'] = JSON.stringify(Game);
                            window.location.href = `MPQuizzesGame.html`;
                            break;
                        }
                }
            }
        }
      }, 2000);
}
// Checks whether the user is verified
function CheckIsVerified() {
    const api = `${apiStart}/Users/IsUserVerified/id/${GetUserID()}`;
    ajaxCall("GET", api, "", CheckIsVerifiedSCB, (e) => {if (typeof e === "boolean") CheckIsVerifiedSCB(e); else window.location.href = 'index.html'; });
}
// if not, can't play multiplayer.
function CheckIsVerifiedSCB(data) {
    if (!data) {
        openPopup('ERROR', 'red', "You must be verified to play multiplayer!");
        setTimeout(() => { window.location.href = 'index.html'; }, 2000);
        return;
    }
}
// Updates active games for the player to join
function UpdateActiveGames() {
    let counter = 1;
    let str = `<ul class="album_list_name">
    <li>#</li>
    <li>Players</li>
    <li>Questions</li>
</ul>`;
    if (currentActiveGames != null) {
        for (i in currentActiveGames) {
            // console.log(currentActiveGames[i]);
            if (currentActiveGames[i].isActive && currentActiveGames[i].isWaitingForPlayers) {
                str += `<ul><li onclick='JoinGame("${i}")'><a href="javascript:void(0)"><span class="play_no">${counter < 10 ? "0" + counter : counter}</span><span class="play_hover"></span></a></li>
                <li><a href="javascript:void(0)">${currentActiveGames[i].players.length}</a></li>
                <li><a href="javascript:void(0)">${currentActiveGames[i].questions}</a></li></ul>`;
            counter++;
            }
        }
    }
    let tmp = true;
    if (currentActiveGames == null || Object.keys(currentActiveGames).length == 0) // if there are no games to play right now
        str += `<p style="color:white;font-size:20px;margin-top:20px;">No Active Games At This Time</p>`;
    else {
        for (i of Object.keys(currentActiveGames)) // checks if there's any active games
        if (currentActiveGames[i].isActive)
        {
            tmp = false;
            break;
        }
        if (tmp) str += `<p style="color:white;font-size:20px;margin-top:20px;">No Active Games At This Time</p>`;
    }
    document.getElementById('FavoritesContainer').innerHTML = str;
}
// Joins game. Used on clients which are not the owner of the game, to join another game.
async function JoinGame(i) {
    // console.log(i)
    let UserID = GetUserID();
    if (UserID == undefined || UserID < 1) return;
    const hasAnotherGame = await DoesUserHasActiveGame(UserID);
    if (hasAnotherGame) {
        console.log("Already owning another game");
        openPopup('ERROR', 'red', 'You already own another active game!');
        // TODO: Already has game
        return;
    }
    else
    {
        let gameId = currentActiveGames[i].id;
    database.ref('Games').orderByChild('id').equalTo(gameId).once('value')
    .then(function(snapshot) {
        const gameData = snapshot.val();
        if (gameData) {
            // The snapshot will contain an object of games with matching gameId (usually just one)
            // To extract the game data, you can use Object.values() to convert the object to an array
            const gameArray = Object.values(gameData);
            const game = gameArray[0]; // Assuming there's only one game with this ID
            console.log('Game data for ID ' + gameId + ':', game);
            // You can use the "game" object here or call another function to handle it.
            if (IsPlayerInGame(game)) { // if already in game, can't join again
                console.log("Player already in game");
                //TODO
                return;
            }
            // Builds the user object to insert into Game.players
            let usr = {
                id: UserID,
                name: (localStorage['User'] == undefined || localStorage['User'] == "") ? JSON.parse(sessionStorage['User']).name : JSON.parse(localStorage['User']).name
            };
            // updates the game object and puts into firebase.
            game.players.push(usr);
            const gameRef = database.ref('Games').child(gameId);
            gameRef.update(game)
            .then(function() {
                console.log("Joined game " + game.id);
                sessionStorage['game'] = JSON.stringify(game);
                window.location.href = `MPQuizzesGame.html`;
            })
            .catch(function(error) {
                 console.error('Error updating game data:', error);
            });
            } else {
                console.log('Game not found for ID ' + gameId);
            }
    })
    .catch(function(error) {
        console.error('Error getting game data for ID ' + gameId + ':', error);
    });
    }
}
// returns true if the player is already in the game, false otherwise.
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
// Function to check if the user has an active game
function DoesUserHasActiveGame(userID) {
    return new Promise((resolve, reject) => {
        // Query the "Games" object to check if the user has an active game
        database.ref('Games')
            .orderByChild('ownerID')
            .equalTo(userID)
            .once('value')
            .then(snapshot => {
                const gamesData = snapshot.val();
                if (gamesData) {
                    // Check if any game has isActive set to true
                    const hasActiveGame = Object.values(gamesData).some(game => game.isActive === true);
                    resolve(hasActiveGame);
                } else {
                    // User does not have any games yet
                    resolve(false);
                }
            })
            .catch(error => {
                reject(error);
            });
    });
}
// Called when a players creates a new game. Inserts the new game to our database
async function InsertGameToDB() {
    let UserID = GetUserID();
    if (UserID == undefined || UserID < 1) return;
    try {
        // Check if the user has an active game
        const hasActiveGame = await DoesUserHasActiveGame(UserID);
        if (hasActiveGame) { // if already owning another game
            console.log("Already owning another game");
        } else { // Builds a game object, and inserts to db
            // Get a new reference under "Games" and use the push method
            const newGameRef = database.ref('Games').push();
            // Get the unique key generated by push and use it as the game ID
            const gameId = newGameRef.key;
            let usr = {
                id: UserID,
                name: (localStorage['User'] == undefined || localStorage['User'] == "") ? JSON.parse(sessionStorage['User']).name : JSON.parse(localStorage['User']).name
            };
            let Game = {
                id: gameId,
                ownerID: UserID,
                players: [usr],
                questions: 5,
                isActive: true,
                isWaitingForPlayers: true
            };
            await newGameRef.set(Game);
            console.log('Game inserted successfully!');
            sessionStorage['game'] = JSON.stringify(Game);
            window.location.href = `MPQuizzesGame.html`;
        }
    } catch (error) {
        console.error('Error inserting game:', error);
    }
}
// returns all the games in our db.
async function getAllGames() {
    try {
        const gamesRef = database.ref('Games');

        const snapshot = await gamesRef.once('value');
        const gamesData = snapshot.val();

        if (gamesData) {
            // Convert the object of games to an array using Object.values()
            const gamesArray = Object.values(gamesData);
            return gamesArray;
        } else {
            return [];
        }
    } catch (error) {
        console.error('Error getting games data:', error);
        return [];
    }
}