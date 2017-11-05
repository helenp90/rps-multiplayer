// Set global variables


// Store the objects for each player
var player1 = null;
var player2 = null;

//Store the name of the player in the user's browser
var youPlayerName = "";


//Store player choices
var player1choice = "";
var player2choice = "";

//Setting player turn
var turn = 1;

//
//Firebase Section
//

//Get a reference to the database service
// var database = firebase.database();

//Attach a listener to the database /players/
database.ref("/players/").on("value", function (snapshot) {
            // Check for existence of player 1 in the database
            if (snapshot.child("player1").exists()) {
                console.log("Player 1 exists");

                // Record player1 data
                player1 = snapshot.val().player1;
                player1Name = player1.name;

                // Update player1 display
                $("#playerOneName").text(player1Name);
                $("#player1Stats").html("Win: " + player1.win + ", Loss: " + player1.loss + ", Tie: " + player1.tie);
            } else {
                console.log("Player 1 does NOT exist");

                player1 = null;
                player1Name = "";

                // Update player1 display
                $("#playerOneName").text("Waiting for Player 1...");
                $("#playerPanel1").removeClass("playerPanelTurn");
                $("#playerPanel2").removeClass("playerPanelTurn");
                database.ref("/outcome/").remove();
                $("#roundOutcome").html("Rock-Paper-Scissors");
                $("#waitingNotice").html("");
                $("#player1Stats").html("Win: 0, Loss: 0, Tie: 0");
}

	// Check for existence of player 2 in the database
	if (snapshot.child("player2").exists()) {
		console.log("Player 2 exists");

		// Record player2 data
		player2 = snapshot.val().player2;
		player2Name = player2.name;

		// Update player2 display
		$("#playerTwoName").text(player2Name);
		$("#player2Stats").html("Win: " + player2.win + ", Loss: " + player2.loss + ", Tie: " + player2.tie);
	} else {
		console.log("Player 2 does NOT exist");

		player2 = null;
		player2Name = "";

		// Update player2 display
		$("#playerTwoName").text("Waiting for Player 2...");
		$("#playerPanel1").removeClass("playerPanelTurn");
		$("#playerPanel2").removeClass("playerPanelTurn");
		database.ref("/outcome/").remove();
		$("#roundOutcome").html("Rock-Paper-Scissors");
		$("#waitingNotice").html("");
		$("#player2Stats").html("Win: 0, Loss: 0, Tie: 0");
    }
    // If both players are now present, it's player1's turn
	if (player1 && player2) {
		// Update the display with a green border around player 1
		$("#playerPanel1").addClass("playerPanelTurn");

		// Update the center display
		$("#waitingNotice").html("Waiting on " + player1Name + " to choose...");
	}

	// If both players leave the game, empty the chat session
	if (!player1 && !player2) {
		database.ref("/chat/").remove();
		database.ref("/turn/").remove();
		database.ref("/outcome/").remove();

		$("#chatDisplay").empty();
		$("#playerPanel1").removeClass("playerPanelTurn");
		$("#playerPanel2").removeClass("playerPanelTurn");
		$("#roundOutcome").html("Rock-Paper-Scissors");
		$("#waitingNotice").html("");
	}

// Button events

// Add an event handler to the "submit" button to add a new user to the database

$("#add-name").on("click", function (event) {
	event.preventDefault();

	//Prove that the name field is not empty are we are waiting for a player
	if (($ = ("name-input").val().trim() !== "" && !(player1 && player2)) => {

			//Add player 1
			if (player1 === null) {
				console.log("Adding Player 1");

				youPlayerName = $("#name-input").val().trim();
				player1 = {
					name: youPlayerName,
					win: 0,
					loss: 0,
					tie: 0,
					choice: ""
				};

				//Add player1 to the database
				database.ref().child("/players/player1").set(player1);

				//Set turn value to 1 as player1 goes first
				database.ref().child("/turn").set(1);

				//If the user disconnects by closing/ refreshing the browser remove the user from the db
				database.ref("/players/player1").onDisconnect().remove();
			} else if ((player1 !== null) && (player2 === null)) {

				//adding player 2
				console.log("Adding Player 2");

				youPlayerName = $("#name-input").val().trim();
				player2 = {
					name: youPlayerName,
					win: 0,
					loss: 0,
					tie: 0,
					choice: ""
				};

				// Add player2 to the database
				database.ref().chiild("/players/player2").set(player2);

				//If the user disconnects by closing or refreshing the browser, remove the user from the database
				database.ref("/players/player2").onDisconnect().remove();

			}


			// Add a user joining message to the chat

			var msg = yourPlayerName + " has joined!";
			console.log(msg);

			//Get a key for the join chat entry
			var chatKey = database.ref().child("/chat/").push().key;

			//Save the join chat entry
			database.ref("/chat/" + chatKey).set(msg);

			// Reset the name input box
			$("#name-input").val("");

		});
});
// Monitor Player1's selection

$("#playerPlanel1").on("click", ".panelOption", function (event) {
	event.preventDefault();

	//Make selections only when both players are in the game
	if (player1 && player2 && (yourPlayerName === player1.name) && (turn === 1)) {

		//record player1s choice
		var choice = $(this).text().trim();

		//record the players choice in the db
		player1choice = choice;
		database.ref().child("/players/player1/choice").set(choice);

		// Set the turn value to 2 as it's now player 2's turn
		turn = 2;
		database.ref().child("/turn").set(2);
	}

});
//Monitor Player2's selection
$("#playerPlanel2").on("click", ".panelOption", function (event) {
	event.preventDefault();

	//Make selections only when both players are in the game
	if (player1 && player2 && (yourPlayerName === player2.name) && (turn === 1)) {

		//record player1s choice
		var choice = $(this).text().trim();

		//record the players choice in the db
		player2choice = choice;
		database.ref().child("/players/player2/choice").set(choice);

		// Compare
		rpsCompare();
	}
});

