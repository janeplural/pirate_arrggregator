function setupRaphaelPaper() {
	var xPapel = window.innerWidth,
			yPapel = (window.innerWidth) / 4,
			Papel = new Raphael('rjs-box', xPapel, yPapel);
	
	Papel.canvas.style.backgroundColor = '#EFF8DB';

	Papel.customAttributes.class = function(name){
		return (this.node.setAttribute("class", name));
	}

	return Papel;
}

function createNewGame(timeToEndgame) {
	return {
		// In seconds
		timeRemaining: timeToEndgame,

		// This will be the interval function
		countdown: null,

		// All of the HTML update stuff goes in here
		updateGameStats: function() {
			updateGameStats('game-timer', this.timeRemaining);
		},
		
		updateCountdown: function() {
			this.timeRemaining = this.timeRemaining - 1;

			this.updateGameStats();
			
			if (this.timeRemaining === 0) {
				this.endTheGame();
			}
		},

		endTheGame: function() {
			clearInterval(this.countdown);
			youCantPlayNoMo();
		},

		restart: function() {
			this.timeRemaining = 0;
			clearInterval(this.countdown);
			this.timeRemaining = timeToEndgame;
			this.start();
		},
		
		start: function() {
			this.updateGameStats();
			this.countdown = setInterval(this.updateCountdown.bind(this), 1000);
		}
	};
}

function drawImages(){
	biggerListOfShuffledImages = makeBigRandomImageList(images);
	funRandomlyTransformedImages = makeFunImageList(Papel, biggerListOfShuffledImages);
	imagesJSON = _.map(funRandomlyTransformedImages, makeImageJSON);

	Papel.add(imagesJSON);
	manageClickableImage($(".clickMe"));
}

function listenToAlertBox() {
	document.getElementById('game-level-alert').children[1].addEventListener('click', function(){
		this.parentElement.classList.add('alert-not-now');
	});
}

function listenForGameStart(game) {
	var nuhHuh = Papel.rect(0, 0, (window.innerWidth), (window.innerWidth / 4));
	nuhHuh.attr({"fill":"#EFF8DB"});
	$("#instructions").removeClass("alert-not-now");
	
	$("#instructions button").on("click", function() {
		nuhHuh.remove();
		$("#instructions").addClass("alert-not-now");
		game.start();
	});
}

// #NOTEtoSelf pick either button or box
// if box work on hover and cursor pointer stuff
function listenForGameRestart(game) {
	$(".restart-game-button").on("click",function(){
		$("#best-player-form").addClass("alert-not-now");
		updateGameStats("game-level", 1);
		updateGameStats("game-score", 0);
		updateGameStats("pirates-found", 0);
		clearImages("pirates-found-count");
		clearImages("rjs-box");
		drawImages();
		$("#reset-alert-box").addClass("alert-not-now");
		if (!$("#game-level-alert").hasClass("alert-not-now")) {
			$("#game-level-alert").addClass("alert-not-now");
			game.restart();		
		} else if ($("#game-level-alert").hasClass("alert-not-now")) {
			game.restart();
		} 
	});
}

/* ********************************* */
/* NON-TOP-LEVEL FUNCTIONS DOWN HERE */
/* ********************************* */


/* Takes a convenient JSON object representing an SVG
 * Returns a JSON object with bells and whistles required by Raphael. */
 // #NOTEtoSelf update add the clickMe class when image names are finalized
 // #NOTEtoSelf update how the src is written too
 // *changed img src for testing
function makeImageJSON(image) {
	var raphImage = {
		type: "image",
		// src: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/" + image.filename,
		src: image.filename,
		// src: "images/" + image.filename,
		x: image.x,
		y: image.y,
		width: image.width,
		height: image.height,
		transform: "r" + image.rotation
	};

	if (image.filename == 'images/Long_Cropped_Louisiana_Renaissance_Festival_Pirate.png'){
		raphImage.class = "clickMe";
		raphImage.height = image.width * 1.68575735;
	}

	return raphImage;
}

function makeRandomImage(x, y, photoWidth, photoHeight) {
	var randomImageWidth = Math.round(_.random(x / 50, x / 10));
	return {
		width: randomImageWidth,
		height: Math.round((photoWidth/photoHeight) * randomImageWidth),
		x: Math.round(_.random(0, x - 50)),
		y: Math.round(_.random(0, y - 50)),
		rotation: _.random(0, 100)
	}
}

function imageIsFun(images, currImage) {
	var imageIsFun = true;

	_.each(images, function(image){
		if (((currImage.width * currImage.height) < (image.width * image.height)) && 
			 ((Math.abs(currImage.x - image.x)) < currImage.size / 2) &&
			 (currImage.height < image.height))
		{
			imageIsFun = false;
		}
	});

	return imageIsFun;
}

function makeFunImageList(Papel, filenames) {
	var images = [];

	// As we construct the total list of images, we'll check each one
	// against all previous images to make sure that they're not covering each other.
	_.each(filenames, function(filename){
		var image;

		image = makeRandomImage(Papel.width, Papel.height, filename.width, filename.height);
			
		while (!imageIsFun(images, image)) {
			image = makeRandomImage(Papel.width, Papel.height, filename.width, filename.height);
		}

		image.filename = filename.name;

		images.push(image);
	});

	return images;
}

function makeBigRandomImageList(filenames) {
	shuffledImages = _.shuffle(filenames);
	level = parseInt(document.getElementById("game-level").innerHTML, 10);

	// balloon our list to be bigger but still random
  _.times(filenames.length * 1, function(){
  	var randomImage = _.sample(filenames);
  	shuffledImages.push(randomImage);
	});

  // this one's special cause we want to click it
  // level is equal to the number of pirates that need to be found
	_.times(level, function(){
		shuffledImages.push({name: "images/Long_Cropped_Louisiana_Renaissance_Festival_Pirate.png",
												width: 398,
												height: 273})
	});

	return shuffledImages;
}

function checkForBestPlayer() {
	var checkForBestPlayer = false;
	var score = parseInt($("#game-score").text());

	$(".top-score").each(function(){
		if (parseInt($(this).text()) <= score) {
			checkForBestPlayer = true;
		}
	});

	return checkForBestPlayer;
}

function youCantPlayNoMo() {
	// Put overlay on gameboard to prevent further clicks
	var nuhHuh = Papel.rect(0, 0, $("svg").width(), $("svg").height());
	nuhHuh.attr({"fill":"red"});
	nuhHuh.attr({"fill-opacity":0.4});

	if (!checkForBestPlayer()) {
		$("#game-level-alert h3").html("GAME OVER");
		$("#confirmation").html("ok");
		$("#reset-alert-box").removeClass("alert-not-now");
		$("#game-level-alert").removeClass("alert-not-now");
	} else if (checkForBestPlayer()) {
		$("#high-score").html($("#game-score").text());
		$("#best-player-form").removeClass("alert-not-now");
		$("input:hidden[name='score']").val(parseInt($("#game-score").text()));
	}

}

// #NOTEtoSelf add fade in & out
// #NOTEtoSelf change the pirate image here too
// *changed img src for testing
function addPirateToCount(count){
	// var pirate = _.template("<img class='pirate-icon' src='assets/square_Louisiana_Renaissance_Festival_Pirate.png'>");
	var pirate = _.template("<img class='pirate-icon' src='images/square_Louisiana_Renaissance_Festival_Pirate.png'>");
	if (count > 0) {
	$("#pirates-found-count").append(pirate);
	} 
	else if (count == 0) {
	$("#pirates-found-count").html(_.template(""));
	}
}

function updateGameStats(id, metrics) {
	var stat = document.getElementById(id);
	stat.innerHTML = metrics;
	if (id == "pirates-found") {
		addPirateToCount(metrics);
	}
}

function clearImages(cssSelector) {
	if (cssSelector == "rjs-box") {
		var currPapel = document.getElementById(cssSelector).firstChild;
	} else {
		var currPapel = document.getElementById(cssSelector);
	}
	while (currPapel.lastChild) {
	  currPapel.removeChild(currPapel.lastChild);
	}
}

// #NOTEtoSelf troubleshoot templating!
function advanceToNextLevel(currlevel) {
	if (currlevel > 1){
		var currLevelInfo = _.template("<div>You've found all " + currlevel + " Pirates!</br>Advance to level " + (currlevel += 1) + "</div>");
	} else if (currlevel == 1) {
		var currLevelInfo = _.template("<div>You've found the Pirate!</br>Advance to level " + (currlevel += 1) + "</div>");
	}
	$("#game-level-alert h3").html(currLevelInfo);
	document.getElementById('game-level-alert').classList.remove('alert-not-now');
	updateGameStats('game-level', currlevel);
	updateGameStats('pirates-found', 0);

	// clear Papel & draw images
	clearImages("rjs-box");
	drawImages();
}

function calculateNonsensicalScore(image) {
	var size = parseInt(image.attributes["width"].value),
			scoreSheet = [5000, 1500, 800, 675, 500, 300, 150, 100],
			score = parseInt(document.getElementById("game-score").innerHTML, 10);
	if (size < 30) {
		score = score + scoreSheet[0]
	} else if (size > 30 && size <= 50) {
		score = score + scoreSheet[1]
	} else if (size > 50 && size <= 65) {
		score = score + scoreSheet[2]
	} else if (size > 65 && size <= 85) {
		score = score + scoreSheet[3]
	} else if (size > 85 && size <= 100) {
		score = score + scoreSheet[4]
	}	else if (size > 100 && size <= 200) {
		score = score + scoreSheet[5]
	} else if (size > 200 && size <= 300) {
		score = score + scoreSheet[6]
	}  else if (size > 300) {
		score = score + scoreSheet[7]
	} 
	updateGameStats("game-score", score);
}

// NOTEtoSelf setTimeout() production should be 300, testing at 500
function manageClickableImage(image) {
	var level = parseInt(document.getElementById("game-level").innerHTML, 10);
	var piratesFound = parseInt(document.getElementById("pirates-found").innerHTML, 30);
	var thatFunction = function(){
		var boo = function(){
			piratesFound += 1
			updateGameStats('pirates-found', piratesFound);
			calculateNonsensicalScore(this);
			this.remove();
			if (piratesFound === level) {
				setTimeout(function(){advanceToNextLevel(level)}, 500); //production should be 300, testing at 500
			}
		}.bind(this)
		boo()
	}
	image.each(function(){this.addEventListener('click', thatFunction)});
}

function keeperOfBestPlayers() {
	$("#best-players-link").on("click", function() {
		$("#best-players").toggleClass("alert-not-now");
	});
}

// #NOTEtoSelf update images array with real photos
// *changed img src for testing
var images = [{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/apple.png",
								width: 194,
								height: 179},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/blueberries.png",
								width: 209,
								height: 161},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/bust.png",
								width: 200,
								height: 106},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/cat.png",
							 width: 75,
							 height: 100},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/cherry.png",
							 width: 209,
							 height: 155},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/child.png",
							 width: 209,
							 height: 157},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/chipmunk.png",
							 width: 148,
							 height: 195},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/fish.png",
							 width: 156,
							 height: 225},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/globe.png",
							 width: 150,
							 height: 150},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/lemons.png",
							 width: 153,
							 height: 225},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/old_woman.png",
							 width: 150,
							 height: 150},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/quarterback.png",
							 width: 113,
							 height: 150},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/scary_house.png",
							 width: 72,
							 height: 164},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/seagull.png",
							 width: 60,
							 height: 156},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/ship.png",
							 width: 200,
							 height: 162},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/truck.png",
							 width: 113,
							 height: 150},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/welcome_to_nc.png",
							 width: 151,
							 height: 179},
							{name: "https://s3-us-west-2.amazonaws.com/pirate-arrggregator/white_flower.png",
							 width: 150,
							 height: 150}],
		biggerListOfShuffledImages,
		funRandomlyTransformedImages,
		imagesJSON,
		Papel,
		game;
