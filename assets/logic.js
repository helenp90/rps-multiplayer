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
var database = firebase.database();

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




;
});
