class Menu {
	constructor() {
		this.pid = localStorage.getItem('yesnaga_pid') || '';
		this.showInstructions = false;
		this.showNewGameOptions = false;
		this.textSelectAtPlayer1 = true;
		this.player1 = '';
		this.player2 = '';
	}

	setup() {
		this.newGameOptionsItems = {
			player1: {
				color: '#F79B18',
				textAndPosition: ['Player 1', 350, 190],
				position: {
					x: 300,
					y: 200,
					width: 250,
					height: 60,
				},
				click: () => this.textSelectAtPlayer1 = true,
			},
			player2: {
				color: '#00ADEF',
				textAndPosition: ['Player 2', 650, 190],
				position: {
					x: 600,
					y: 200,
					width: 250,
					height: 60,
				},
				click: () => menu.textSelectAtPlayer1 = false,
			},
			confirmButton: {
				color: 'green',
				textAndPosition: ['LOS GEHT\'S!', 575, 335],
				position: {
					x: 475,
					y: 300,
					width: 200,
					height: 60,
				},
				click: () => createGame(menu.player1, menu.player2),
			},
		};

		this.menuItems = {
			title: {
				content: 'YESNAGA',
				color: 'black',
				position: {
					x: 310,
					y: 60,
					height: 90,
					width: 500,
				},
				textSize: 120,
				allowHovering: false,
				click() {
					console.log('https://github.com/Ojself/yesnaga');
				},
			},
			newGame: {
				content: 'New Game',
				color: 'black',
				position: {
					x: 400,
					y: 250,
					height: 90,
					width: 450,
				},
				textSize: 85,
				// textSize: width / 14,
				allowHovering: true,
				click: () => {
					menu.showNewGameOptions = true;
				},
			},
			continueGame: {
				content: 'Continue Game',
				color: menu.pid ? 'black' : 'grey',
				position: {
					x: 310,
					y: 370,
					height: 90,
					width: 450,
				},
				textSize: 85,
				allowHovering: !!menu.pid,
				click: () => {
					continueGame(menu.pid);
				},
			},
			instructions: {
				content: 'Instructions',
				color: 'black',
				position: {
					x: 390,
					y: 490,
					height: 90,
					width: 450,
				},
				textSize: 85,
				allowHovering: true,
				click: () => menu.showInstructions = !menu.showInstructions,
			},
		};
	}

	draw() {
		clear();

		if (this.showNewGameOptions) {
			drawNewGameOptions(this.newGameOptionsItems, this.player1, this.player2);
		} else {
			Object.keys(this.menuItems).forEach((menuItem) => {
				const item = this.menuItems[menuItem];
				item.hovering = hoveringItemCheck(item);
				drawContent(item);
			});
		}

		if (this.showInstructions) {
			push();
			textSize(width / 60);
			fill('black');
			textAlign(CENTER, TOP);
			text(instructions, 600, this.menuItems.instructions.position.y + 100);
			pop();
		}
	}

	mouseClicked() {
		if (this.showNewGameOptions) {
			const currentGameOption = Object.keys(this.newGameOptionsItems).find((gameOption) => hoveringItemCheck(this.newGameOptionsItems[gameOption]));

			if (currentGameOption) this.newGameOptionsItems[currentGameOption].click();
			return;
		}
		const currentMenuItem = Object.keys(this.menuItems).find((menuItem) => hoveringItemCheck(this.menuItems[menuItem]));
		if (currentMenuItem) this.menuItems[currentMenuItem].click();
	}

	keyPressed(key) {
		// ignores all input if the input fields are now visibles
		if (!this.showNewGameOptions) {
			// allows for quickly getting back into the game
			if (key === 'Enter') continueGame(this.pid);
			return;
		}

		switch (key) {
			// alternates between playerinput fields
			case 'Tab':
				this.textSelectAtPlayer1 = !this.textSelectAtPlayer1;
				break;
				// shortcut to start the game
			case 'Enter':
				createGame(this.player1, this.player2);
				// Allows the player to redifine the name
			case 'Backspace':
				if (this.textSelectAtPlayer1) {
					this.player1 = this.player1.slice(0, -1);
				} else {
					this.player2 = this.player2.slice(0, -1);
				}
			default:
				// prevents meta keys (ALT, TAB, BACKSPACE etcs)
				// prevents too long names
				if (key.length > 1 || this.player1.length > 18 || this.player2.length > 18) return;
				if (this.textSelectAtPlayer1) {
					this.player1 += key;
				} else {
					this.player2 += key;
				}
				break;
		}
	}
}

const hoveringItemCheck = (item) => {
	const { position } = item;
	return position.y < mouseY
        && position.y + position.height > mouseY
        && position.x < mouseX
        && position.x + position.width > mouseX;
};

// Draws title, new game etc
const drawContent = (menuItem) => {
	textAlign(LEFT);
	textSize(menuItem.textSize);
	fill(menuItem.hovering && menuItem.allowHovering ? '#F79B18' : menuItem.color);
	text(menuItem.content, menuItem.position.x, menuItem.position.y, width);
};


// Draws aditional options when starting a new game
const drawNewGameOptions = (newGameOptionsItems, player1Name, player2Name) => {
	drawPlayerInput(newGameOptionsItems.player1, player1Name);
	drawPlayerInput(newGameOptionsItems.player2, player2Name);

	// textSelectCursor
	if (frameCount % 60 > 30) {
		// prevents the textselect to show if name has a value
		if ((menu.textSelectAtPlayer1 && !player1Name) || (!menu.textSelectAtPlayer1 && !player2Name)) {
			fill('black');
			const selectPosition = menu.textSelectAtPlayer1 ? [315, 215, 315, 245] : [615, 215, 615, 245];
			line(...selectPosition);
		}
	}

	// confirmButton
	const { position } = newGameOptionsItems.confirmButton;
	fill(newGameOptionsItems.confirmButton.color);
	rect(position.x, position.y, position.width, position.height, 20);
	textSize(width / 60);
	fill('white');
	text(...newGameOptionsItems.confirmButton.textAndPosition);
};

// draws input field and name for player
const drawPlayerInput = (player, name) => {
	fill(player.color);
	text(...player.textAndPosition);
	fill('white');
	const { position } = player;
	rect(position.x, position.y, position.width, position.height, 20);
	fill('black');
	textAlign(LEFT);
	text(name, position.x + 20, position.y + 35);
	textAlign(CENTER);
};

// allows to continue game by existing pid stored in local storage
const continueGame = (pid) => {
	if (!pid) return;

	fetch(`api/games/${pid}`, { method: 'GET' })
		.then((result) => result.json())
		.then((formattedResult) => {
			game = new Game(formattedResult);
		})
		.catch((error) => console.error('error', error));
};

// generates a new game
const createGame = (player1Name, player2Name) => {
	const body = JSON.stringify({ players: [player1Name || 'orange', player2Name || 'blue'] });
	const myHeaders = new Headers();
	myHeaders.append('Content-Type', 'application/json');
	const requestOptions = {
		method: 'PUT',
		headers: myHeaders,
		body,
	};

	fetch('api/games', requestOptions)
		.then((result) => result.json())
		.then((formattedResult) => {
			localStorage.setItem('yesnaga_pid', formattedResult.pid);
			game = new Game(formattedResult);
		})
		.catch((error) => console.error('error', error));
};


const instructions = `The game has a hexagonal playing area composed of 19 discs,
     with each player having three moveable tokens, that start in alternating vertices around the hexagon.
    Every turn, a player must do two things, in order:
    
        - Move one of their tokens in a straight line up to the end of the board or up to colliding with another token
        - Move one of the exterior empty discs to another location on the playing area where it touches at least two discs.
    Whoever first manages to connect their three tokens wins!`;
