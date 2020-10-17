
const instructions =
    `The game has a hexagonal playing area composed of 19 discs,
     with each player having three moveable tokens, that start in alternating vertices around the hexagon.
    Every turn, a player must do two things, in order:
    
        - Move one of their tokens in a straight line up to the end of the board or up to colliding with another token
        - Move one of the exterior empty discs to another location on the playing area where it touches at least two discs.
    Whoever first manages to connect their three tokens wins!`

const newGameOptionsItems = {
    player1: {
        color: '#F79B18',
        textAndPosition: ['Player 1', 350, 180],
        position: {
            x: 300,
            y: 200,
            width: 250,
            height: 60,
        },
        click: () => menu.textSelectAtPlayer1 = true
    },
    player2: {
        color: '#00ADEF',
        textAndPosition: ['Player 2', 650, 180],
        position: {
            x: 600,
            y: 200,
            width: 250,
            height: 60,
        },
        click: () => menu.textSelectAtPlayer1 = false
    },
    confirmButton: {
        color: 'green',
        textAndPosition: [`LOS GEHT'S!`, 575, 320],
        position: {
            x: 475,
            y: 300,
            width: 200,
            height: 60
        },
        click: () => createGame(menu.player1, menu.player2)
    }
}

class Menu {
    constructor() {
        this.pid = localStorage.getItem('yesnaga_pid') || '';
        this.showInstructions = false
        this.showNewGameOptions = false
        this.textSelectAtPlayer1 = true
        this.player1 = ''
        this.player2 = ''
    }
    setup() {
        this.menuItems = {
            title: {
                content: 'YESNAGA',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 60,
                textSize: width / 10,
                allowHovering: false,
                click: function () {
                    console.log('https://github.com/Ojself/yesnaga')
                }
            },
            newGame: {
                content: 'New Game',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 250,
                textSize: width / 14,
                allowHovering: true,
                click: () => {
                    this.showNewGameOptions = true
                    this.hideAllMenuItems()
                }
            },
            continueGame: {
                content: 'Continue Game',
                color: this.pid ? 'black' : 'grey',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 370,
                textSize: width / 14,
                allowHovering: !!this.pid,
                click: () => {
                    continueGame(this.pid)
                }
            },
            instructions: {
                content: 'Instructions',
                color: 'black',
                textAlign: [CENTER, TOP],
                x: 0,
                y: 490,
                textSize: width / 14,
                allowHovering: true,
                click: () => this.showInstructions = !this.showInstructions
            },
        }
    }

    draw() {
        clear()
        Object.keys(this.menuItems).forEach((menuItem) => {
            const item = this.menuItems[menuItem]
            item.hovering = hoveringMenuItemCheck(item)
            drawContent(item)
        })

        if (this.showNewGameOptions) {
            drawNewGameOptions(this.player1, this.player2)
        }

        if (this.showInstructions) {
            textSize(width / 60);
            fill("black")
            textAlign(CENTER, TOP)
            text(instructions, 600, this.menuItems.instructions.y + 100)
        }

    }
    mouseClicked(event) {
        if (this.showNewGameOptions) {
            const currentGameOption = Object.keys(newGameOptionsItems).find(gameOption => {
                return hoveringGameOption(newGameOptionsItems[gameOption])
            })

            if (currentGameOption) newGameOptionsItems[currentGameOption].click()
            return
        }
        const currentMenuItem = Object.keys(this.menuItems).find(menuItem => {
            return hoveringMenuItemCheck(this.menuItems[menuItem], event)
        })
        if (currentMenuItem) this.menuItems[currentMenuItem].click()
    }
    hideAllMenuItems(exception = '') {
        this.showInstructions = false
        Object.keys(this.menuItems).forEach(menuItem => {
            this.menuItems[menuItem].hide = !exception.includes(menuItem)
        })
    }
    keyPressed(key) {
        // ignores all input if the input fields are now visibles
        if (!this.showNewGameOptions) {
            // allows for quickly getting back into the game
            if (key === 'Enter') continueGame(this.pid)
            return
        }

        switch (key) {
            // alternates between playerinput fields
            case 'Tab':
                this.textSelectAtPlayer1 = !this.textSelectAtPlayer1
                break;
            // shortcut to start the game
            case 'Enter':
                createGame(this.player1, this.player2)
            // Allows the player to redifine the name
            case 'Backspace':
                if (this.textSelectAtPlayer1) {
                    this.player1 = this.player1.slice(0, -1);
                } else {
                    this.player2 = this.player2.slice(0, -1);
                }
            default:
                // prevents meta keys (ALT, TAB, BACKSPACE etcs)
                if (key.length > 1) return
                if (this.textSelectAtPlayer1) {
                    this.player1 += key
                } else {
                    this.player2 += key
                }
                break;
        }

    }
}

const hoveringGameOption = (gameOption) => {
    const { position } = gameOption
    return position.y < mouseY
        && position.y + position.height > mouseY
        && position.x < mouseX
        && position.x + position.width > mouseX
}

const hoveringMenuItemCheck = (menuItem, event = { pageY: mouseY + 30, pageX: mouseX + 30 }) => {
    const [verticalOffset, horizontalOffset] = [40, 490]
    const { pageY, pageX } = event
    const [adjustedY, adjustedX] = [pageY - verticalOffset, pageX - horizontalOffset]

    // TODO add horizontal check too
    return adjustedY > menuItem.y
        && adjustedY < menuItem.y + menuItem.textSize
        && adjustedX > menuItem.x
        && adjustedX < menuItem.x + width / 2
}

const drawContent = (menuItem) => {
    if (menuItem.hide) return;
    textSize(menuItem.textSize);
    textAlign(...menuItem.textAlign)
    fill(menuItem.hovering && menuItem.allowHovering ? 'orange' : menuItem.color)
    text(menuItem.content, menuItem.x, menuItem.y, width)
}



const drawNewGameOptions = (player1Name, player2Name) => {
    drawPlayerInput(newGameOptionsItems.player1, player1Name)
    drawPlayerInput(newGameOptionsItems.player2, player2Name)


    // textSelectCursor
    fill('black')
    if (frameCount % 60 > 30) {
        // prevents the textselect to show if name has a value
        if ((menu.textSelectAtPlayer1 && !player1Name) || (!menu.textSelectAtPlayer1 && !player2Name)) {
            const selectPosition = menu.textSelectAtPlayer1 ? [315, 215, 315, 245] : [615, 215, 615, 245]
            line(...selectPosition)
        }
    }

    // confirmButton
    const { position } = newGameOptionsItems.confirmButton
    fill(newGameOptionsItems.confirmButton.color)
    rect(position.x, position.y, position.width, position.height, 20)
    textSize(width / 60)
    fill('white')
    text(...newGameOptionsItems.confirmButton.textAndPosition)
}


const drawPlayerInput = (player, name) => {
    fill(player.color)
    text(...player.textAndPosition)
    fill('white')
    const { position } = player
    rect(position.x, position.y, position.width, position.height, 20)
    fill('black')
    textAlign(LEFT)
    text(name, position.x + 20, position.y + 20)
    textAlign(CENTER)
}


const continueGame = pid => {
    if (!pid) return

    fetch(`api/games/${pid}`, { method: 'GET', })
        .then(result => result.json())
        .then(formattedResult => {
            game = new Game(formattedResult);
        })
        .catch(error => console.error('error', error));

}

const createGame = (player1Name, player2Name) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const requestOptions = {
        method: 'PUT',
        headers: myHeaders,
        body: JSON.stringify({ "players": [player1Name || 'orange', player2Name || 'blue'] }),
    };

    fetch("api/games", requestOptions)
        .then(result => result.json())
        .then(formattedResult => {
            game = new Game(formattedResult);
        })
        .catch(error => console.error('error', error));
}