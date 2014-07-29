$(function() {
	
	Papel = setupRaphaelPaper();
	
	game = createNewGame(30);

	drawImages();
	keeperOfBestPlayers();
	listenToAlertBox();
	listenForGameStart(game);
	listenForGameRestart(game);

});

