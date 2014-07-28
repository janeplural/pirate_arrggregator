$(function() {
	
	Papel = setupRaphaelPaper();
	
	game = createNewGame(30);

	drawImages();
	keeperOfBestPlayers();
	listenToAlertBox();
	listenForGameRestart(game);

	game.start();

});

