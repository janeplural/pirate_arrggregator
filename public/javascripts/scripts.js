$(function() {
	
	Papel = setupRaphaelPaper();
	
	// #NOTEtoSelf production is 60, testing 30
	game = createNewGame(30);

	drawImages();
	keeperOfBestPlayers();
	listenToAlertBox();
	listenForGameStart(game);
	listenForGameRestart(game);

});

